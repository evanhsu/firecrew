<?php

use App\Domain\Crews\Crew;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CrewStatusesTableSeeder extends Seeder
{

    public function run()
    {
        DB::table('crew_statuses')->delete();

        $rightNow = Carbon::now();
        $oldtime = Carbon::now()->subday(); // A timestamp from yesterday

        /********************************/
        /* Grand Canyon Short Haul Crew */
        /********************************/
        $crew = Crew::where('name', 'Grand Canyon Short Haul Crew')->first();
        $user = $crew->users()->first();
        $statusArray = array(
            'crew_id'               => $crew->id,
            'latitude'              => 42.454223,
            'longitude'             => -123.310388,
            'popup_content'         => "",
            'intel'                 => "This is update #1 for GCSHC",
            'personnel_1_name'      => "Charlie Barley",
            'personnel_1_role'      => "HMGB(t)",
            'personnel_1_location'  => "National Training Academy",
            'personnel_1_note'      => "Managing the light aircraft at academy until 6/4",
            'personnel_2_name'      => "Vince Carver",
            'personnel_2_role'      => "ATGS",
            'personnel_2_location'  => "The Lonely Mountain Fire",
            'personnel_2_note'      => "Air attack on Lonely Mountain until 6/28",
            'created_by_name'       => $user->name,
            'created_by_id'         => $user->id,
            'created_at'            => $oldtime,
            'updated_at'            => $oldtime,
        );
        $status = $crew->statuses()->create($statusArray);

        $statusArray = array(
            'crew_id'               => $crew->id,
            'latitude'              => 42.454223,
            'longitude'             => -123.310388,
            'popup_content'         => "",
            'intel'                 => "Placing equipment orders on 7/6.",
            'personnel_1_name'      => "Charlie Barley",
            'personnel_1_role'      => "HMGB(t)",
            'personnel_1_location'  => "National Training Academy",
            'personnel_1_note'      => "Managing the light aircraft at academy until 6/4",
            'personnel_2_name'      => "Vince Carver",
            'personnel_2_role'      => "ATGS",
            'personnel_2_location'  => "The Lonely Mountain Fire",
            'personnel_2_note'      => "Due back earlier than expected - tomorrow at 1430",
            'created_by_name'       => $user->name,
            'created_by_id'         => $user->id,
            'created_at'            => $rightNow,
            'updated_at'            => $rightNow,
        );
        $status = $crew->statuses()->create($statusArray);

        /********************************/
        /* Price Valley                 */
        /********************************/

        $crew = Crew::where('name', 'Price Valley Helirappellers')->first();
        $user = $crew->users()->first();
        $statusArray = array(
            'crew_id'               => $crew->id,
            'latitude'              => 42.454223,
            'longitude'             => -123.310388,
            'popup_content'         => "",
            'intel'                 => "Base is empty, lightning in the forecast.",
            'personnel_1_name'      => "Prince Vallez",
            'personnel_1_role'      => "HERS(t)",
            'personnel_1_location'  => "Wenatchee",
            'personnel_1_note'      => "Training assignment with WVR",
            'personnel_2_name'      => "Carrie Fisher",
            'personnel_2_role'      => "CRWB",
            'personnel_2_location'  => "The Lonely Mountain Fire",
            'personnel_2_note'      => "Type 2 crew assignment on Lonely Mountain.",
            'created_by_name'       => $user->name,
            'created_by_id'         => $user->id,
            'created_at'            => $rightNow,
            'updated_at'            => $rightNow,
        );
        $status = $crew->statuses()->create($statusArray);

        /********************************/
        /* Prineville Hotshots          */
        /********************************/

        $crew = Crew::where('name', 'Prineville Hotshots')->first();
        $user = $crew->users()->first();
        $statusArray = array(
            'crew_id'               => $crew->id,
            'latitude'              => 42.454223,
            'longitude'             => -123.310388,
            'popup_content'         => "",
            'intel'                 => "Assigned to Gasquet. Last day 7/21.",
            'personnel_1_name'      => "Ralph Jameson",
            'personnel_1_role'      => "FINV",
            'personnel_1_location'  => "Investigator workshop",
            'personnel_1_note'      => "Re-upping quals",
            'created_by_name'       => $user->name,
            'created_by_id'         => $user->id,
            'created_at'            => $rightNow,
            'updated_at'            => $rightNow,
        );
        $status = $crew->statuses()->create($statusArray);

        /********************************/
        /* Redding Smokejumpers         */
        /********************************/
        $crew = Crew::where('name', 'Redding Smokejumpers')->first();
        $user = $crew->users()->first();
        $statusArray = array(
            'crew_id'               => $crew->id,
            'latitude'              => 42.454223,
            'longitude'             => -123.310388,
            'popup_content'         => "",
            'intel'                 => "",
            'personnel_1_name'      => "Brant Lesley",
            'personnel_1_role'      => "TFLD",
            'personnel_1_location'  => "Brightenward Fire",
            'personnel_1_note'      => "",
            'personnel_2_name'      => "Chad Billups",
            'personnel_2_role'      => "SOF2",
            'personnel_2_location'  => "Stickman Fire",
            'personnel_2_note'      => "",
            'created_by_name'       => $user->name,
            'created_by_id'         => $user->id,
            'created_at'            => $oldtime,
            'updated_at'            => $oldtime,
        );
        $status = $crew->statuses()->create($statusArray);

    }
}
