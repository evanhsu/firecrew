<?php

namespace App\Domain\Crews;

use App\Domain\StatusableResources\AbstractStatusableResource;
use App\Domain\Statuses\CrewStatus;
use App\Domain\Statuses\ResourceStatus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use App\Domain\Items\Item;
use App\Domain\People\Person;
use App\Domain\Users\User;
use Illuminate\Support\Facades\DB;

class Crew extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'address_street1',
        'address_street2',
        'address_city',
        'address_state',
        'address_zip',
        'phone',
        'fax',
        'logo_filename',
        'statusable_type',
        'dispatch_center_name',
        'dispatch_center_identifier',
        'dispatch_center_daytime_phone',
        'dispatch_center_24_hour_phone',
        'webhook_url',
        ];



	public static $types = [
		'handcrew'	    => 'Handcrew',
		'hotshot'	    => 'Interagency Hotshot Crew',
		'engine'	    => 'Engine Crew',
		'helitack'	    => 'Helitack Crew',
		'shorthaul'	    => 'Short Haul Crew',
		'rappel'	    => 'Rappel Crew',
		'smokejumper'   => 'Smokejumper Base',
		'district'	    => 'A Ranger District or fire compound',
	];

    public function statusableResources() {
         return $this->hasMany(AbstractStatusableResource::class);
    }

    public function resourceStatuses() {
        return $this->hasManyThrough(ResourceStatus::class, AbstractStatusableResource::class, 'crew_id', 'statusable_resource_id');
    }

    /**
     * Returns a Collection of ResourceStatus objects that represents the most recent
     * status for each StatusableResource owned by this Crew.
     * @return mixed
     */
    public function latestResourceStatuses() {

        $latestStatusForEachResource = DB::select('
            select  t1.*
                from resource_statuses as t1
                left join resource_statuses as t2
                  on t1.statusable_resource_id = t2.statusable_resource_id
                  and t1.created_at < t2.created_at
                inner join statusable_resources
                  on statusable_resources.id = t1.statusable_resource_id
            where t2.created_at is NULL
                and statusable_resources.crew_id = :id', ['id' => $this->id]);

        $statuses = ResourceStatus::hydrate($latestStatusForEachResource);

        return $statuses->map(function($status) {
            return $status->load('resource'); // Return the nested 'ResourceStatus->resource' object as well
        });
    }

    public function resourcesWithLatestStatus() {
        return $this->statusableResources()->with('latestStatus');
    }

	public function people() {
		return $this->belongsToMany(Person::class, 'crew_person');
	}

	public function roster($year) {
		return $this->people()->wherePivot('year',$year);
	}

	public function items() {
		return $this->hasMany(Item::class);
	}

	public function users() {
	    return $this->hasMany(User::class);
    }

    public function statuses() {
        return $this->hasMany(CrewStatus::class);
    }

    public function status() {
        // Get the MOST RECENT CrewStatus for this Crew
//        return $this->statuses()->orderBy('created_at','desc')->first();

        return $this->hasOne(CrewStatus::class)->latest();
    }


    public function freshness() {
        // Check the timestamp of the most recent update for this Crew.
        // Return 'fresh', 'stale', 'expired', or 'missing' depending on age thresholds.
        //
        // NOTE: if this function is called on a Crew that has Helicopters, the freshness verb will
        //       refer to the length of time that has passed since ANY of this Crew's helicopters were updated.
        $max_fresh_age = config('app.hours_until_updates_go_stale');
        $expiration_age= config('app.days_until_updates_expire') * 24; // Converted to hours
        $now = Carbon::now();
        $last_status = $this->status();
        if(is_null($last_status->id)) $freshness = "missing"; // No Status has ever been created for this Crew
        else {
            $last_update = $last_status->created_at;
            $age_hours = $now->diffInHours($last_update);  // The number of hours between NOW and the last update

            if($age_hours <= $max_fresh_age) $freshness = "fresh";
            elseif(($age_hours > $max_fresh_age) && ($age_hours < $expiration_age)) $freshness = "stale";
            else $freshness = "expired";
        }
        return $freshness;
    }
    public function is_fresh() {
        if($this->freshness() == "fresh") return true;
        else return false;
    }
    public function is_stale() {
        if($this->freshness() == "stale") return true;
        else return false;
    }
    public function is_expired() {
        if($this->freshness() == "expired") return true;
        else return false;
    }
    public function has_no_updates() {
        if($this->freshness() == "missing") return true;
        else return false;
    }
}
