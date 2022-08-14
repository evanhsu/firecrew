<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Links that are generated with the `route()` helper (and links to static assets) will
        // use https:// instead of http:// in the production environment.
        // This is controlled by the FORCE_HTTPS env var
        if(config('app.force_https')) {
            URL::forceScheme('https');
        }
    }
}
