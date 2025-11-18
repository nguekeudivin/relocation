<?php

namespace App\Http\Controllers\Contribution;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\UserRole;
use Inertia\Inertia;

class ContributionPages extends Controller
{
    public function listing()
    {
        return Inertia::render('admin/contributions/listing');
    }

    public function analytics(){
        return Inertia::render('admin/contributions/analytics');
    }

}
