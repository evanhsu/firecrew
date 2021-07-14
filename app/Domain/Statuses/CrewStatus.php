<?php

namespace App\Domain\Statuses;

use App\Domain\Crews\Crew;
use Illuminate\Database\Eloquent\Model;

class CrewStatus extends Model
{

    protected $table = "crew_statuses";
    protected $touches = ["crew"];
    /**
     * The attributes that are NOT mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    public function crew()
    {
        return $this->belongsTo(Crew::class);
    }
}
