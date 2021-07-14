<?php

namespace App\Http\Controllers;

use App\Domain\Crews\Crew;
use App\Services\PeopleService;
use App\Http\Transformers\PersonTransformer;
use Illuminate\Http\Request;

class PeopleController extends Controller
{
    protected $people;

    public function __construct(PeopleService $people)
    {
        $this->people = $people;
    }

    /**
     *  Returns a collection of ALL People in the database
     *
     */
    public function indexAll()
    {
        $people = $this->people->all();

        return $this->response->collection(
            $people,
            new PersonTransformer,
            ['key' => 'person']
        );
    }

    /**
     *  Returns a collection of People associated with the specified Crew during the specified year
     *
     */
    public function indexForCrew($crewId, $year = null) {

        $crew = Crew::findOrFail($crewId);
        $year = is_null($year) ? Date::today()->format('Y') : $year; // Use the current year is none was specified

        $people = $this->people->byCrewAndYear($crew, $year);

        return $this->response->collection(
            $people,
            new PersonTransformer,
            ['key' => 'person']
        );
    }
}
