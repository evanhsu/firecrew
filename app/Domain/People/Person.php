<?php

namespace App\Domain\People;

use App\Domain\Crews\Crew;
use App\Domain\Items\CanHaveItemsAbstract;
use App\Domain\Items\Item;

class Person extends CanHaveItemsAbstract
{
    protected $appends = ['full_name'];
    protected $dates = [
        'created_at',
        'updated_at',
        'birthdate',
    ];

    
    public function crews() {
    	return $this->belongsToMany(Crew::class, 'crew_person');
    }

    public function crewYear($year) {
    	return $this->crews()->wherePivot('year', $year);
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . " " . $this->last_name;
    }

    public function issueItem($item)
    {
        return $this->items()->save($item);
    }

    public function items()
    {
    	return $this->morphMany(Item::class, 'checked_out_to');
    }
}
