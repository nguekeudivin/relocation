<?php

namespace App\Services\QueryService;

use Illuminate\Support\Str;
use App\Services\ReflectionHelper;

class PermissionGuard
{
    protected $permissions = [];

    public function setPermissions($permissions)
    {
        $this->permissions = $permissions;
    }

    public function can($operation, $model, $attribute = null)
    {
        if ($attribute != null) {
            return in_array("{$model}:{$operation}:{$attribute}", $this->permissions);
        }

        return in_array("{$model}:{$operation}", $this->permissions);
    }

    public function parseQuery(string $model, object $query): object
    {
        $parsed = [];

        // Filtrer la clause 'select'
        if (isset($query->select)) {

            $select = [];
            foreach ($query->select as $attribute) {
                if ($this->can('view', $model, $attribute) || $this->can('view', $model, "*")) {
                    $select[] = $attribute;
                }
            }

            if (!empty($select)) {
                $parsed['select'] = $select;
            }
        }

        // Filtrer les attributs computed
        if (isset($query->computed)) {

            $computed = [];
            foreach ((array) $query->computed as $attribute => $args) {
                if ($this->can('view', $model, $attribute) || $this->can('view', $model, "*")) {
                    $computed[$attribute] = $args;
                }
            }

            if (!empty($computed)) {
                $parsed['computed'] = $computed;
            }
        }


        // Parse relations
        if (isset($query->rels)) {

            $rels = [];

            foreach ($query->rels as $relationName => $relationQuery) {
                // Get the relation class and the relation model.
                $relatedClass = ReflectionHelper::getRelationClass($model, $relationName);
                if ($relatedClass == null) {
                    continue;
                }
                $relatedModel = ReflectionHelper::getModelFromClass($relatedClass);

                // check we have normal access to the relation
                if ($this->can('view', $model, $relationName) || $this->can('view', $model, "*")) {

                    $relationQueryParsed = $this->parseQuery($relatedModel, (object)$relationQuery);

                    if (isset($relationQueryParsed->select)) {
                        $rels[$relationName] = $relationQueryParsed;
                    }

                } else {
                    // If not check if have access under a filter condition.
                    $filters = $this->getRelationFilters($model, $relationName, $relatedClass);
                    if (!empty($filters)) {

                        $relationQueryParsed = $this->parseQuery($relatedModel, (object)$relationQuery);

                        if (isset($relationQueryParsed->select)) {
                            $rels[$relationName] = $relationQueryParsed;
                            $rels[$relationName]->filters = $filters;
                        }
                    }
                }
            }

            if (!empty($rels)) {
                $parsed['rels'] = $rels;
            }
        }

        // Conserver les autres clauses
        foreach (['clauses', 'order', 'paginate', 'limit'] as $key) {
            if (isset($query->$key)) {
                $parsed[$key] = $query->$key;
            }
        }

        return (object) $parsed;
    }

    public function getFilters(string $model): array
    {
        $filters = [];
        $modelClass = ReflectionHelper::getModelClass($model);

        if (method_exists($modelClass, 'queryFilters')) {
            foreach (($modelClass::queryFilters() ?? []) as $filterName => $func) {
                if ($this->can('list', $model, $filterName)) {
                    $filters[] = $filterName;
                }
            }
        }

        return $filters;
    }

    public function getRelationFilters(string $model, string $relationName, $relatedClass)
    {
        $filters = [];
        if (method_exists($relatedClass, 'queryFilters')) {
            foreach (($relatedClass::queryFilters() ?? []) as $filterName => $filterFunction) {

                if ($this->can('view', $model, "{$relationName}:{$filterName}")) {
                    $filters[] = $filterName;
                }
            }
        }
        return $filters;
    }


}
