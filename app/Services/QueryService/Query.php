<?php

namespace App\Services\QueryService;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Services\Helpers;

class Query
{
    protected $request;
    protected $guard;
    protected $builder;
    protected $runner;
    protected $models = [
        "user" => \App\Models\User::class,
    ];

    public function __construct(
        PermissionGuard $guard,
        EloquentQueryBuilder $builder,
        QueryRunner $runner,
        Request $request
    ) {
        $this->guard = $guard;
        $this->builder = $builder;
        $this->runner = $runner;
        $this->request = $request;
    }

    public function xorDecript($data)
    {
        $key = env('QUERY_KEY');

        $data = base64_decode($data);
        $out = '';
        $keyLength = strlen($key);
        for ($i = 0; $i < strlen($data); $i++) {
            $out .= $data[$i] ^ $key[$i % $keyLength];
        }
        return $out;
    }

    public function run($user, $withPermissions = true)
    {

        // check user
        if ($user == null) {
            return [];
        }

        // Set the use permissions
        $userPermissions = $user->getPermissions();

        // Parse the query
        $decryptedJSONString = $this->xorDecript($this->request->input('query'));
        $requestQuery = (array) json_decode($decryptedJSONString, true);
        $finalResult = [];

        // Define need informations
        $this->guard->setPermissions($userPermissions);
        $this->builder->setUser($user);
        $this->runner->setUser($user);

        // We check is the request is well define.
        if (!is_array($requestQuery)) {
            return []; // Or raise an exception.
        }

        foreach ($requestQuery as $index => $modelQuery) {

            // If the query definition is null we continue.
            if (empty((array) $modelQuery)) {
                continue;
            }

            $model = Str::singular(Str::studly($index));
            $modelClass = Helpers::getModelClass($model);

            if (!$modelClass) {
                continue; // Or raise an exception.
            }

            // Init the new query before checking the permissions.
            $newQuery = $modelQuery;

            if ($withPermissions) {
                $hasAccess = false; // by default we assume the user can list model instance

                // If the user can list the model then he have access.
                if ($this->guard->can('list', $model)) {
                    $hasAccess = true;
                };

                // Look for access under filters conditions
                $filters = [];
                if (!$hasAccess) {
                    $filters = $this->guard->getFilters($model);
                    if (empty($filters)) {
                        continue;
                    }
                }

                $newQuery = $this->guard->parseQuery($model, (object) $modelQuery);
                $newQuery->filters = $filters;

                if (!isset($newQuery->select)) {
                    continue;
                }
            }

            $eloquentQuery = $this->builder->build($modelClass, (object) $newQuery);
            $finalResult[$index] = $this->runner->run($eloquentQuery, (object) $newQuery);

        }

        return $finalResult;
    }
}
