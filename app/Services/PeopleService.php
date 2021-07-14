<?php
namespace App\Services;

use App\Domain\Crews\Crew;
use App\Domain\People\Person;

class PeopleService
{
	public function all()
	{
		return Person::all();
	}

	public function byCrewAndYear(Crew $crew, $year)
	{
		return $crew->people()->wherePivot('year',$year)->get();
	}
}
