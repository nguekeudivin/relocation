<?php

namespace App\Services\QueryService;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use App\Models\User;

class EloquentQueryBuilder
{
    protected $user = null;

    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * Construit une requête Eloquent à partir de la définition de la requête.
     */
    public function build(string $modelClass, object $definition): Builder
    {
        $model = new $modelClass();
        $eloquentQuery = $model->newQuery();

        // Appliquer les clauses de base (select, where, order)
        $eloquentQuery = $this->evaluateQuery($eloquentQuery, $definition);

        // Appliquer les relations (avec leurs propres sous-requêtes)
        if (property_exists($definition, "rels")) {

            $this->evaluateRels((object) $eloquentQuery, (object)$definition->rels);
        }

        return $eloquentQuery;
    }

    /**
     * Évalue et applique les clauses de base de la requête (select, where, order).
     */
    protected function evaluateQuery(Builder $eloquentQuery, object $definition): Builder
    {

        // Evaluate select
        if (property_exists($definition, "select")) {
            $eloquentQuery->select(...$definition->select);
        }

        // Evaluates clauses
        if (property_exists($definition, "clauses")) {
            foreach ($definition->clauses as $clause) {
                $this->evaluateClause($eloquentQuery, $clause['name'], $clause['value']);
            }
        }

        //Evaluate order.
        if (property_exists($definition, "order")) {
            foreach ($definition->order as $item) {
                $eloquentQuery->orderBy(...$item);
            }
        }

        return $eloquentQuery;
    }

    /**
     * Recursively evaluates query clauses, applying them to the query builder.
     */
    protected function evaluateClause(Builder $eloquentQuery, string $clauseName, $value): void
    {
        if (is_array($value) && is_object(reset($value))) {
            $eloquentQuery->{$clauseName}(function ($q) use ($value) {
                foreach ($value as $subClause) {
                    $this->evaluateClause($q, $subClause->name, $subClause->value);
                }
            });
        } else {
            $eloquentQuery->{$clauseName}(...$value);
        }
    }

    /**
     * Évalue et charge les relations eager loading avec leurs propres contraintes.
     */
    protected function evaluateRels(Builder $eloquentQuery, object $rels): void
    {
        $with = [];

        $user = $this->user;

        foreach ((array) $rels as $relationName => $definition) {

            $with[$relationName] = function ($relation) use ($relationName, $definition, $user) {

                $query = $relation->getQuery();

                $definition = (object)$definition;

                if (property_exists($definition, "select")) {

                    $this->ensureRelationshipKeys($relation, $query);
                    $query->addSelect(...$definition->select);
                }

                if (property_exists($definition, "clauses")) {
                    foreach ($definition->clauses as $clause) {
                        $this->evaluateClause($query, $clause->name, $clause->value);
                    }
                }

                if (property_exists($definition, "order")) {
                    foreach ($definition->order as $item) {
                        $query->orderBy(...$item);
                    }
                }

                if (property_exists($definition, "rels")) {
                    $this->evaluateRels($query, (object)$definition->rels);
                }

                //Appliquer les filtres de requete si presents
                if (isset($definition->filters) && is_array($definition->filters)) {

                    $modelClass = $query->getModel()::class;
                    $filters = $modelClass::queryFilters() ?? [];

                    $query->where(function (Builder $someQuery) use ($definition, $filters, $user) {
                        // The operation that is apply for filters is the UNION so we need to chain the filters by a "orWhere" operator.
                        // So the filter is call directy. The implementation of the filter inside the model may call a "Where" operator on him.
                        // And the other are wrapped inside a orWhere operator.
                        // Hence we are sure to apply the UNION.
                        $first = true;
                        foreach ($definition->filters as $filterName) {
                            if (isset($filters[$filterName]) && is_callable($filters[$filterName])) {
                                if (!$first) {
                                    $someQuery->orWhere(function (Builder $q) use ($filters, $filterName, $user) {
                                        $filters[$filterName]($q, $user);
                                    });
                                } else {
                                    $filters[$filterName]($someQuery, $user);
                                    $first = false;
                                }
                            }
                        }

                    });

                }

            };

        }

        if (!empty($with)) {
            $eloquentQuery->with($with);
        }
    }

    /**
     * Automatically adds required keys for any relationship type
     */
    protected function ensureRelationshipKeys($relation, Builder $query): void
    {
        $requiredKeys = $this->getRequiredKeysForRelation($relation);

        // Filter out already selected columns
        $existingColumns = $query->getQuery()->columns ?: [];
        $keysToAdd = array_diff($requiredKeys, $existingColumns);

        if (!empty($keysToAdd)) {
            $query->addSelect($keysToAdd);
        }
    }

    /**
     * Gets required keys for all relationship types
     */
    protected function getRequiredKeysForRelation($relation): array
    {
        $keys = [$relation->getRelated()->getQualifiedKeyName()];

        if ($relation instanceof BelongsTo || $relation instanceof HasOneOrMany) {
            $keys[] = $relation->getQualifiedForeignKeyName();
        }

        if ($relation instanceof MorphOneOrMany) {
            $keys[] = $relation->getQualifiedMorphType();
        }

        return $keys;
    }
}
