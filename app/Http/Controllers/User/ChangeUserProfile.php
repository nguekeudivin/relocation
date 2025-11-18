<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserRole;
use Illuminate\Support\Facades\Auth;

class ChangeUserProfile extends Controller
{
    public function __invoke(Request $request, UserRole $userRole)
    {
        $user = Auth::user();

        $user->current_user_role_id = $userRole->id;
        $user->save();

        switch ($userRole->role->type) {
            case 'admin':
                return redirect()->to('admin/dashboard');
                break;
            default:
                return redirect()->to('member/profile');
        }
    }
}
