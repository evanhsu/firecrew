<?php namespace App\Providers;

use View;
use Illuminate\Support\ServiceProvider;

class ComposerServiceProvider extends ServiceProvider {

    /**
     * Specify that the MenubarComposer should be called whenever the 'menubar' View is invoked
     *
     * @return void
     */
    public function boot()
    {
        // Bind each Composer to its Views

        // The MenubarComposer should be called whenever the 'menubar' View is invoked
        View::composer('menubar', 'App\Http\ViewComposers\MenubarComposer');
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