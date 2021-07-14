<?php

namespace App\Domain\Users;

use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the user.
     *
     * @param  \App\Domain\Users\User $authUser The User making the request
     * @param  \App\Domain\Users\User $user The User entry being accessed
     * @return mixed
     */
    public function view(User $authUser, User $user)
    {
        //
    }

    /**
     * Determine whether the user can create users.
     *
     * @param  \App\Domain\Users\User $user
     * @return mixed
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the user.
     *
     * @param  \App\Domain\Users\User $authUser The User making the request
     * @param  \App\Domain\Users\User $user The User entry being accessed
     * @return mixed
     */
    public function update(User $authUser, User $user)
    {
        //
    }

    /**
     * Determine whether the user can delete the user.
     *
     * @param  \App\Domain\Users\User $authUser The User making the request
     * @param  \App\Domain\Users\User $user The User entry being accessed
     * @return mixed
     */
    public function delete(User $authUser, User $user)
    {
        //
    }
}
