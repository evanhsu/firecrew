<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

                // To use Gates in a controller:
        //   if(Gate::allows('access-crew', $crew_id)) {...}
        //   if(Gate::denies('access-crew', $crew_id)) {...}

        Gate::define('access-crew', function ($user, $crewId) {
            return ($user->isGlobalAdmin() || ($user->crew_id === $crewId));
        });

        Gate::define('destroy-user', function ($user, $userToDestroy) {
            return $user->isGlobalAdmin() || 
                $user->isAdminForCrew($userToDestroy->crew_id) ||
                $user->id === $userToDestroy->id;
        });

        Gate::define('act-as-admin-for-crew', function ($user, $crew) {
            // Allow $crew to be passed in as either a Crew object OR an Integer crew_id
            // If $crew is NULL, return FALSE.... UNLESS the $user is a Global Admin
            if (is_object($crew)) return $user->isAdminForCrew($crew->id);
            elseif (is_numeric($crew)) return $user->isAdminForCrew(intval($crew));
            else return false; // An invalid data type was passed in for $crew (only integer or Crew Object are allowed)
        });

//        // The current user must be on the same crew as the Crew object passed in AND have the specified User->permission
//        // If $action is null, User->hasPermission($action) will return TRUE
//        Gate::define('performActionForCrew', function($currentUser, $targetCrew, $action=null) {
//
//            return ($currentUser->crew_id === $targetCrew->id)
//                && ($currentUser.hasPermission($action));
//
//        })->before(function($currentUser, $ability) {
//            // Global Admin users will always be granted this permission
//            if($currentUser->isGlobalAdmin()) {
//                return true;
//            }
//        });


        // The current user must be on the same crew as the user being destroyed, unless the current user is a Global Admin
        Gate::define('destroy-user', function($currentUser, $userToDestroy) {

            return $currentUser->crew_id === $userToDestroy->crew_id;

        })->before(function($currentUser, $ability) {
            // Global Admin users will always be granted this permission
            if($currentUser->isGlobalAdmin()) {
                return true;
            }
        });
    }
}
