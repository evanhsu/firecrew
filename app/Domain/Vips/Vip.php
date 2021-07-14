<?php

namespace App\Domain\Vips;

use App\Domain\Items\CanHaveItemsAbstract;
use App\Domain\Crews\Crew;
use App\Domain\Items\Item;

/**
 *  A Vip is a temporary person who is created solely to check out an item.
 *
**/
class Vip extends CanHaveItemsAbstract
{
    protected $appends = ['full_name'];

    
    public function crew() {
    	return $this->belongsTo(Crew::class);
    }

    public function getFullNameAttribute() {
        return $this->name;
    }

    public function items()
    {
    	return $this->morphMany(Item::class, 'checked_out_to');
    }

    public function issueItem($item)
    {
        return $this->items()->save($item);
    }
}
