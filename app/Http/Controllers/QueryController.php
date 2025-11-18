<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\QueryService\Query;
use App\Services\QueryService\PermissionGuard;
use App\Services\QueryService\EloquentQueryBuilder;
use App\Services\QueryService\QueryRunner;
use Exception;

class QueryController extends Controller
{
    protected $queryService;

    public function __construct(Query $queryService)
    {
        $this->queryService = $queryService;
    }

    public function index(Request $request)
    {

        $user = $request->user();

        return response()->json($this->queryService->run($user, false));
    }
}
