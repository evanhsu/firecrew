<?php
namespace App\Providers;

use App\Http\ViewComposers\MenubarComposer;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class ViewServiceProvider extends ServiceProvider {

    /**
     * Specify that the MenubarComposer should be called whenever the 'menubar' View is invoked
     *
     * @return void
     */
    public function boot()
    {
        // Bind each Composer to its Views

        // The MenubarComposer should be called whenever the 'menubar' View is invoked
        View::composer('menubar', MenubarComposer::class);
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        //
    }

}
