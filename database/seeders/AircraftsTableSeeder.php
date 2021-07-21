<?php
namespace Database\Seeders;

use App\Domain\Aircrafts\RappelHelicopter;
use App\Domain\Aircrafts\ShortHaulHelicopter;
use App\Domain\Aircrafts\SmokeJumperAirplane;
use App\Domain\Crews\Crew;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AircraftsTableSeeder extends Seeder
{

    public function run()
    {
        DB::table('aircrafts')->delete();

        $crew = Crew::where("statusable_type", "=", ShortHaulHelicopter::class)->first();
        ShortHaulHelicopter::create(array(
            'tailnumber'  => 'N1111',
            'model'       => 'Astar B350',
            'crew_id'     => $crew->id
        ));
        ShortHaulHelicopter::create(array(
            'tailnumber'  => 'N2222',
            'model'       => 'MD-900',
            'crew_id'     => $crew->id
        ));


        $crew = Crew::where("statusable_type", RappelHelicopter::class)->first();
        Rappelhelicopter::create(array(
            'tailnumber'  => 'N3333',
            'model'       => 'Bell 407',
            'crew_id'     => $crew->id
        ));


        $crew = Crew::where("statusable_type", SmokeJumperAirplane::class)->first();
        SmokeJumperAirplane::create(array(
            'tailnumber'  => 'J-89',
            'model'       => 'C-130',
            'crew_id'     => $crew->id
        ));
        SmokeJumperAirplane::create(array(
            'tailnumber'  => 'J-83',
            'model'       => 'DHC-6',
            'crew_id'     => $crew->id
        ));


        // This helicopter is not assigned to a Crew
        Rappelhelicopter::create(array(
            'tailnumber'  => 'N4444',
            'model'       => 'Bell 205',
            'crew_id'     => null
        ));

    }
}
