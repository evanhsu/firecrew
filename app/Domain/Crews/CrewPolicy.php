<?php

namespace App\Domain\Crews;

use App\Domain\Users\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CrewPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the crew.
     *
     * @param  \App\Domain\Users\User  $user
     * @param  \App\Domain\Crews\Crew  $crew
     * @return mixed
     */
    public function view(User $user, Crew $crew)
    {
        //
    }

    /**
     * Determine whether the user can create crews.
     *
     * @param  \App\Domain\Users\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the crew.
     *
     * @param  \App\Domain\Users\User  $user
     * @param  \App\Domain\Crews\Crew  $crew
     * @return mixed
     */
    public function update(User $user, Crew $crew)
    {
        //
    }

    /**
     * Determine whether the user can delete the crew.
     *
     * @param  \App\Domain\Users\User  $user
     * @param  \App\Domain\Crews\Crew  $crew
     * @return mixed
     */
    public function delete(User $user, Crew $crew)
    {
        //
    }
}
