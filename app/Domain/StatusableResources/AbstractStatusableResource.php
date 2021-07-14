<?php

namespace App\Domain\StatusableResources;

use App\Domain\Crews\Crew;
use App\Domain\Statuses\ResourceStatus;
use App\Domain\Users\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class AbstractStatusableResource extends Model
{
    protected $table = 'statusable_resources';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['identifier', 'model', 'crew_id'];


    protected static function boot()
    {
        parent::boot();
        self::creating(function ($model) {
            $model->resource_type = self::resourceType();
        });
    }

    public function crew()
    {
        return $this->belongsTo(Crew::class);
    }

    public function users()
    {
        return $this->hasManyThrough(User::class, Crew::class);
    }

    public function statuses()
    {
        return $this->hasMany(ResourceStatus::class, 'statusable_resource_id');
    }

    public function latestStatus()
    {
        return $this->hasOne(ResourceStatus::class, 'statusable_resource_id')->latest();
    }

    public function status()
    {
        // Get the MOST RECENT status for this Aircraft
        return $this->latestStatus();
    }

    public function toSubclass()
    {
        $subclass= "App\\Domain\\StatusableResources\\$this->resource_type";
        return $subclass::find($this->id);
    }

    public function freshness()
    {
        // Check the timestamp of the most recent update for this Aircraft.
        // Return 'fresh', 'stale', 'expired', or 'missing' depending on age thresholds.

        $max_fresh_age = config('app.hours_until_updates_go_stale');
        $expiration_age = config('app.days_until_updates_expire') * 24; // Converted to hours

        $now = Carbon::now();
        $last_status = $this->status;
        if (!is_null($last_status)) {
            $last_update = $last_status->created_at;
            $age_hours = $now->diffInHours($last_update);  // The number of hours between NOW and the last update

            if ($age_hours <= $max_fresh_age) $freshness = "fresh";
            elseif (($age_hours > $max_fresh_age) && ($age_hours < $expiration_age)) $freshness = "stale";
            else $freshness = "expired";
        } else {
            $freshness = "missing"; // No Status has ever been created for this Aircraft
        }

        return $freshness;
    }

    public function is_fresh()
    {
        if ($this->freshness() == "fresh") return true;
        else return false;
    }

    public function is_stale()
    {
        if ($this->freshness() == "stale") return true;
        else return false;
    }

    public function is_expired()
    {
        if ($this->freshness() == "expired") return true;
        else return false;
    }

    public function has_no_updates()
    {
        if ($this->freshness() == "missing") return true;
        else return false;
    }

    public function release()
    {
        // Disassociate this "resource" from it's Crew (set StatusableResource->crew_id to NULL)
        $this->crew()->dissociate();
        if ($this->save()) {
            return true;
        }
        else {
            return false;
        }
    }
}