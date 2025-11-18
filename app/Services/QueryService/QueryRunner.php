<?php

namespace App\Services\QueryService;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use App\Models\User;

class QueryRunner
{
    protected $request;

    protected $user = null;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function setUser($user)
    {
        $this->user = $user;
    }

    public function run(Builder $eloquentQuery, object $queryDefinition): mixed
    {

        $user = $this->user; // Definir le user.

        // Appliquer les filtres de requête si présents
        if (isset($queryDefinition->filters) && is_array($queryDefinition->filters)) {
            $modelClass = $eloquentQuery->getModel()::class;
            // Appeler la méthode statique pour obtenir le tableau des filtres
            $modelFilters = $modelClass::queryFilters() ?? [];

            $eloquentQuery->where(function (Builder $query) use ($queryDefinition, $modelFilters, $user) {
                $first = true;
                foreach ($queryDefinition->filters as $filterName) {
                    if (isset($modelFilters[$filterName]) && is_callable($modelFilters[$filterName])) {
                        if (!$first) {
                            $query->orWhere(function (Builder $q) use ($modelFilters, $filterName) {
                                $modelFilters[$filterName]($q, $user);
                            });
                        } else {
                            $modelFilters[$filterName]($query, $user);
                            $first = false;
                        }
                    }
                }
            });
        }



        // Gérer la pagination
        if (property_exists($queryDefinition, "paginate") && !property_exists($queryDefinition, "limit")) {
            $page = $queryDefinition->paginate[0] ?? null;
            $perPage = $queryDefinition->paginate[1];
            return $eloquentQuery->paginate($perPage, ['*'], 'page', $page)->toArray();
        }

        // Gérer la limite
        if (property_exists($queryDefinition, "limit")) {

            return $eloquentQuery->limit($queryDefinition->limit)->get();
        }

        if (property_exists($queryDefinition, "groupBy")) {
            return $eloquentQuery->get()->groupBy($queryDefinition->groupBy);
        }

        // Retourner tous les résultats si ni la pagination ni la limite ne sont spécifiées
        return $eloquentQuery->get();
    }
}
