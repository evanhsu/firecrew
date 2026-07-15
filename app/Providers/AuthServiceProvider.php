<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [];

    public function boot(): void
    {
        Gate::define('access-crew', function ($user, $crewId) {
            return $user->isGlobalAdmin() || ($user->crew_id === $crewId);
        });

        Gate::define('destroy-user', function ($user, $userToDestroy) {
            return $user->isGlobalAdmin()
                || $user->isAdminForCrew($userToDestroy->crew_id)
                || $user->id === $userToDestroy->id;
        });

        Gate::define('act-as-admin-for-crew', function ($user, $crew) {
            if (is_object($crew)) {
                return $user->isAdminForCrew($crew->id);
            }

            if (is_numeric($crew)) {
                return $user->isAdminForCrew((int) $crew);
            }

            return false;
        });
    }
}
