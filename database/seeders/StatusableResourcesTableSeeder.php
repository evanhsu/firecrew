<?php

use App\Domain\StatusableResources\RappelHelicopter;
use App\Domain\StatusableResources\ShortHaulHelicopter;
use App\Domain\StatusableResources\SmokejumperAirplane;
use App\Domain\Crews\Crew;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusableResourcesTableSeeder extends Seeder
{

    public function run()
    {
        DB::table('statusable_resources')->delete();

        $crew = Crew::where("name", "=", "Grand Canyon Short Haul Crew")->first();
        ShortHaulHelicopter::create(array(
            'identifier'  => 'N17HJ',
            'model'       => 'Astar B350',
            'crew_id'     => $crew->id
        ));
        ShortHaulHelicopter::create(array(
            'identifier'  => 'N213WT',
            'model'       => 'MD-900',
            'crew_id'     => $crew->id
        ));


        $crew = Crew::where("name", "Price Valley Helirappellers")->first();
        Rappelhelicopter::create(array(
            'identifier'  => 'N313CH',
            'model'       => 'Bell 205',
            'crew_id'     => $crew->id
        ));
        Rappelhelicopter::create(array(
            'identifier'  => 'N314CH',
            'model'       => 'Bell 205',
            'crew_id'     => $crew->id
        ));


        $crew = Crew::where("name", "Redding Smokejumpers")->first();
        SmokejumperAirplane::create(array(
            'identifier'  => 'J-89',
            'model'       => 'C-130',
            'crew_id'     => $crew->id
        ));
        SmokejumperAirplane::create(array(
            'identifier'  => 'J-83',
            'model'       => 'DHC-6',
            'crew_id'     => $crew->id
        ));


        // This helicopter is not assigned to a Crew
        Rappelhelicopter::create(array(
            'identifier'  => 'N4444',
            'model'       => 'Bell 205',
            'crew_id'     => null
        ));

    }
}
