<?php

namespace App\Http\Controllers\Deploy;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Artisan;

/**
 * Exécute `php artisan migrate:fresh --seed --force` via HTTP.
 *
 * Sécurisé par DEPLOY_TOKEN (env) : l'endpoint renvoie 404 si le token
 * n'est pas défini ou ne correspond pas.
 *
 * ⚠️ DESTRUCTIF : supprime toutes les tables avant de les recréer.
 */
class RunMigrations extends Controller
{
    public function __invoke(string $token)
    {
        $expected = (string) env('DEPLOY_TOKEN', '');

        abort_unless($expected !== '' && hash_equals($expected, $token), 404);

        set_time_limit(0);

        Artisan::call('migrate:fresh', [
            '--force' => true,
            '--seed'  => true,
        ]);

        return response('<pre>' . e(Artisan::output()) . '</pre>');
    }
}
