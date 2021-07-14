<?php

namespace App\Domain\Users;

use App\Domain\Crews\Crew;
use App\Domain\Statuses\ResourceStatus;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'crew_id',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];


    public function crew()
    {
        return $this->belongsTo(Crew::class);
    }


    protected function authenticated(Request $request, User $user)
    {
        // This is the URL that a user is sent to after successfully logging in
        return redirect()->intended('/crews/' . $this->crew_id . '/status');
    }

    public function lastStatus()
    {
        // Returns the most recent Status submitted by this User
        // If none are found, return NULL
        return ResourceStatus::where('created_by_id', $this->id)->orderBy('created_at', 'desc')->first();
    }

    /**
     * Determine whether this User can alter user accounts for members of the specified crew
     *
     * @var integer $crew_id
     * @return bool
     */
    public function isAdminForCrew($crew_id)
    {
        if (!$crew_id) {
            return false;
        }

        if (($this->crew_id === $crew_id) || $this->isGlobalAdmin()) {
            return true;
        }

        return false;
    }

    public function isGlobalAdmin()
    {
        return (bool)$this->global_admin;
    }
}
