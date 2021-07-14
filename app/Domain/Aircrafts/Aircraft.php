<?php

namespace App\Domain\Aircrafts;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Domain\Crews\Crew;
use App\Domain\Users\User;
use App\Domain\Statuses\ResourceStatus;

class Aircraft extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'aircrafts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['tailnumber', 'model', 'crew_id'];

    /**
     * The attributes excluded from the models JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    public function classname()
    {
        // Return the name of the class that $this is an instance of
        return static::class;
    }

    /**
     * Define relationships to other Eloquent models
     *
     */
    public function crew()
    {
        // Each AIRCRAFT belongs to a CREW (the AIRCRAFT model contains a 'crew_id' foreign index)
        return $this->belongsTo(Crew::class);
    }

    public function users()
    {
        // Allow access to the Users who have permission to edit this Aircraft
        return $this->hasManyThrough(User::class, Crew::class);
    }

    public function statuses()
    {
        // Create a relationship with the polymorphic Status model
        return $this->morphMany('App\Domain\Statuses\ResourceStatus', 'statusable');
    }

    public function status()
    {
        // Get the MOST RECENT status for this Aircraft
        // If NONE are found, return a NEW, blank status to be filled in.
        $status = $this->statuses()->orderBy('created_at', 'desc')->first();
        if (is_null($status)) return new ResourceStatus;
        else return $status;
    }

    public function subclass()
    {
        // Return an instance of the requested aircraft's subclass
        $classname = $this->crew->statusable_type;
        return $classname::find($this->id);
    }

    public function get_crew_id()
    {
        // This is simply an alias for this->crew->id to provide a consistent notation for querying the crew id for all resource types
        return $this->crew_id;
    }

    public function freshness()
    {
        // Check the timestamp of the most recent update for this Aircraft.
        // Return 'fresh', 'stale', 'expired', or 'missing' depending on age thresholds.

        $max_fresh_age = config('app.hours_until_updates_go_stale');
        $expiration_age = config('app.days_until_updates_expire') * 24; // Converted to hours

        $now = Carbon::now();
        $last_status = $this->status();
        if ($last_status->exists) {
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
        // Disassociate this aircraft from it's Crew (set Aircraft->crew_id to NULL)
        $this->crew()->dissociate();
        if ($this->save()) return true;
        else return false;
    }

    private function differences(Aircraft $aircraft)
    {
        // Compare the current Aircraft model to the input $aircraft.
        // Return an array of the object properties that differ, if any differences exist.
        // Return NULL if the two models are identical.

        $properties_to_compare = array('tailnumber', 'model', 'crew_id');
        $differences = array();

        foreach ($properties_to_compare as $p) {
            if ($this->$p != $aircraft->$p) {
                $differences[] = $p;
            }
        }

        if (sizeof($differences) == 0) {
            return null;
        } else {
            //print_r($differences);
            return $differences;
        }
    }

    public function updateIfChanged($attributes)
    {
        // Compare the attributes of $this Aircraft to the array of $attributes passed in.
        // If they match, don't update this instance.
        // If there are differences, update $this with the values from $attributes.
        //
        // Return FALSE if there are errors
        // Return TRUE otherwise
        //    Note: this function will return TRUE even if no update is performed, as long as there are no errors.

        // Convert tailnumber to all caps before storing - Laravel has no way of performing
        // a case-insensitive search within the Eloquent ORM, so we must ensure all tailnumbers use consistent case.
        $attributes['tailnumber'] = strtoupper($attributes['tailnumber']);
        $proposed_aircraft = new Aircraft($attributes);

        if (is_null($this->differences($proposed_aircraft))) {
            // This aircraft already matches the proposed attributes. Do nothing.
            return true;
        } // This aircraft instance needs to be updated
        elseif ($this->update($attributes)) {
            // The model was updated
            return true;
        } else {
            // There was an error while updating the model
            return false;
        }
    }
}
