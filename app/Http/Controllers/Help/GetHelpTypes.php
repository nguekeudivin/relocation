<?php

namespace App\Http\Controllers\Help;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HelpType;

class GetHelpTypes extends Controller
{
    public function __invoke(Request $request)
    {
        $page    = $request->input('page', 1);
        $perPage = $request->input('per_page', 15);
        $keyword = $request->input('keyword');

        $query = HelpType::query();

        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        $helpTypes = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($helpTypes);
    }
}
