<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\App;

class SetLocaleQueryParam
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
         // Force locale if ?lang=xx is provided
        if ($request->has('lang')) {
            $locale = $request->query('lang','en');
            App::setLocale($locale);
        }else{
            // Optionally, you can append the app locale to the request object
            $request->merge(['lang' => App::getLocale()]);
        }

        return $next($request);
    }
}
