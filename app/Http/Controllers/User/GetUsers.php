<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class GetUsers extends Controller
{
    public function __invoke(Request $request)
    {
        $page    = $request->input('page', 1);
        $perPage = $request->input('per_page', 15);
        $keyword = $request->input('keyword');
        $status  = $request->input('status');

        $query = User::query();

        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('first_name', 'like', "%{$keyword}%")
                  ->orWhere('last_name', 'like', "%{$keyword}%")
                  ->orWhere('email', 'like', "%{$keyword}%")
                  ->orWhere('phone_number', 'like', "%{$keyword}%");
            });
        }

        if ($status) {
            // Handle single value or array
            $statuses = is_array($status) ? $status : [$status];
            $query->whereIn('status', $statuses);
        }

        $users = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($users);
    }
}
