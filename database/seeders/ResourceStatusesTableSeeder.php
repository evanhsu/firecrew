<?php
namespace Database\Seeders;

use App\Domain\StatusableResources\RappelHelicopter;
use App\Domain\StatusableResources\ShortHaulHelicopter;
use App\Domain\StatusableResources\SmokeJumperAirplane;
use App\Domain\Crews\Crew;
use App\Domain\Statuses\ResourceStatus;
use App\Domain\Users\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ResourceStatusesTableSeeder extends Seeder
{

    public function run()
    {
        DB::table('resource_statuses')->delete();

        $rightNow = Carbon::now();

        $heli = ShortHaulHelicopter::where("identifier", "N17HJ")->first();
        $crew = $heli->crew;
        $user = $crew->users()->first();
        $oldtime = Carbon::now()->subday(); // A timestamp from yesterday
        $statusArray = array(
            'statusable_resource_type' => $heli->resource_type,
            'statusable_resource_name' => $heli->identifier,
            'latitude' => 42.454223,
            'longitude' => -123.310388,
            'staffing_value1' => "6",
            'staffing_value2' => "0",
            'manager_name' => "Bob Nielson",
            'manager_phone' => "789-566-4430",
            'comments1' => "This is update 1 of 2 from the db seeder",
            'comments2' => "This is upcoming",
            'assigned_fire_name' => "Gasquet Complex",
            'assigned_fire_number' => "WA-FRE-150038",
            'assigned_supervisor' => "John Thompson",
            'assigned_supervisor_phone' => "333-444-5555",
            'distance' => 100,
            'label_text' => ".",
            'created_by_name' => $user->name,
            'created_by_id' => $user->id,
            'created_at' => $oldtime,
            'updated_at' => $oldtime,
            'crew_name' => $crew->name,
            'popup_content' => ""
        );
        $statusArray['popup_content'] = $this->createPopupinfo($statusArray);
        $status = $heli->statuses()->create($statusArray);


        $statusArray = array(
            'statusable_resource_type' => $heli->resource_type,
            'statusable_resource_name' => $heli->identifier,
            'latitude' => 45.464223,
            'longitude' => -117.210388,
            'staffing_value1' => "6",
            'staffing_value2' => "0",
            'manager_name' => "Bob Nielson",
            'manager_phone' => "789-566-4430",
            'comments1' => "Assigned to Gasquet. Shroeder is currently trainee.",
            'comments2' => "",
            'assigned_fire_name' => "Gasquet Complex",
            'assigned_fire_number' => "WA-FRE-150038",
            'assigned_supervisor' => "John Thompson",
            'assigned_supervisor_phone' => "333-444-5555",
            'distance' => 100,
            'label_text' => ".",
            'created_by_name' => $user->name,
            'created_by_id' => $user->id,
            'created_at' => $rightNow,
            'updated_at' => $rightNow,
            'crew_name' => $crew->name,
            'popup_content' => ""
        );
        $statusArray['popup_content'] = $this->createPopupinfo($statusArray);
        $status = $heli->statuses()->create($statusArray);


        $heli = ShortHaulHelicopter::where("identifier", "N213WT")->first();
        $crew = $heli->crew;
        $user = $crew->users()->first();
        $statusArray = array(
            'statusable_resource_type' => $heli->resource_type,
            'statusable_resource_name' => $heli->identifier,
            'latitude' => 44.084223,
            'longitude' => -119.310388,
            'staffing_value1' => "8",
            'staffing_value2' => "2",
            'manager_name' => "Jim Lewis",
            'manager_phone' => "250-778-5443",
            'comments1' => "Last flight was 7/4.",
            'comments2' => "Proficiencies scheduled for 7/13",
            'assigned_fire_name' => "Big Windy",
            'assigned_fire_number' => "OR-RSF-150208",
            'assigned_supervisor' => "Bill Newman",
            'assigned_supervisor_phone' => "333-444-5555",
            'distance' => 100,
            'label_text' => ".",
            'created_by_name' => $user->name,
            'created_by_id' => $user->id,
            'created_at' => $rightNow,
            'updated_at' => $rightNow,
            'crew_name' => $crew->name,
            'popup_content' => ""
        );
        $statusArray['popup_content'] = $this->createPopupinfo($statusArray);
        $status = $heli->statuses()->create($statusArray);


        $heli = RappelHelicopter::where("identifier", "N313CH")->first();
        $crew = $heli->crew;
        $user = $crew->users()->first();
        $statusArray = array(
            'statusable_resource_type' => $heli->resource_type,
            'statusable_resource_name' => $heli->identifier,
            'latitude' => 46.384223,
            'longitude' => -115.310388,
            'staffing_value1' => "6",
            'staffing_value2' => "0",
            'manager_name' => "Steve Borland",
            'manager_phone' => "334-998-6756",
            'comments1' => "Unscheduled maintenance - currently unavailable.",
            'comments2' => "Hopefully we'll be back up before tomorrow morning...",
            'assigned_fire_name' => "",
            'assigned_fire_number' => "",
            'assigned_supervisor' => "",
            'assigned_supervisor_phone' => "",
            'Distance' => 100,
            'label_text' => ".",
            'created_by_name' => $user->name,
            'created_by_id' => $user->id,
            'created_at' => $rightNow,
            'updated_at' => $rightNow,
            'crew_name' => $crew->name,
            'popup_content' => ""
        );
        $statusArray['popup_content'] = $this->createPopupinfo($statusArray);
        $status = $heli->statuses()->create($statusArray);
        $heli = RappelHelicopter::where("identifier", "N313CH")->first();
        $crew = $heli->crew;
        $user = $crew->users()->first();
        $statusArray = array(
            'statusable_resource_type' => $heli->resource_type,
            'statusable_resource_name' => $heli->identifier,
            'latitude' => 46.384223,
            'longitude' => -115.310388,
            'staffing_value1' => "3",
            'staffing_value2' => "4",
            'manager_name' => "Steve Borland",
            'manager_phone' => "334-998-6756",
            'comments1' => "Unscheduled maintenance - currently unavailable.",
            'comments2' => "Hopefully we'll be back up before tomorrow morning...",
            'assigned_fire_name' => "",
            'assigned_fire_number' => "",
            'assigned_supervisor' => "",
            'assigned_supervisor_phone' => "",
            'Distance' => 100,
            'label_text' => ".",
            'created_by_name' => $user->name,
            'created_by_id' => $user->id,
            'created_at' => $rightNow,
            'updated_at' => $rightNow,
            'crew_name' => $crew->name,
            'popup_content' => ""
        );
        $statusArray['popup_content'] = $this->createPopupinfo($statusArray);
        $status = $heli->statuses()->create($statusArray);

        $heli = RappelHelicopter::where("identifier", "N314CH")->first();
        $crew = $heli->crew;
        $user = $crew->users()->first();
        $statusArray = array(
            'statusable_resource_type' => $heli->resource_type,
            'statusable_resource_name' => $heli->identifier,
            'latitude' => 43.384223,
            'longitude' => -115.310388,
            'staffing_value1' => "8",
            'staffing_value2' => "4",
            'manager_name' => "Steve Borland",
            'manager_phone' => "334-998-6756",
            'comments1' => "",
            'comments2' => "",
            'assigned_fire_name' => "",
            'assigned_fire_number' => "",
            'assigned_supervisor' => "",
            'assigned_supervisor_phone' => "",
            'Distance' => 100,
            'label_text' => ".",
            'created_by_name' => $user->name,
            'created_by_id' => $user->id,
            'created_at' => $rightNow,
            'updated_at' => $rightNow,
            'crew_name' => $crew->name,
            'popup_content' => ""
        );
        $statusArray['popup_content'] = $this->createPopupinfo($statusArray);
        $status = $heli->statuses()->create($statusArray);


        $resource = SmokejumperAirplane::where("identifier", "J-83")->first();
        $crew = $resource->crew;
        $user = $crew->users()->first();
        $statusArray = array(
            'statusable_resource_type' => $resource->resource_type,
            'statusable_resource_name' => $resource->identifier,
            'latitude' => 38.511060,
            'longitude' => -118.441425,
            'staffing_value1' => "12",
            'staffing_value2' => "4",
            'manager_name' => "Mark Kennedy",
            'manager_phone' => "789-432-2120",
            'comments1' => "Ready and waiting. Rear-cargo capable, FYI.",
            'comments2' => "",
            'assigned_fire_name' => "",
            'assigned_fire_number' => "",
            'assigned_supervisor' => "",
            'assigned_supervisor_phone' => "",
            'distance' => 100,
            'label_text' => ".",
            'created_by_name' => $user->name,
            'created_by_id' => $user->id,
            'created_at' => $rightNow,
            'updated_at' => $rightNow,
            'crew_name' => $crew->name,
            'popup_content' => ''
        );
        $statusArray['popup_content'] = $this->createPopupinfo($statusArray);
        $status = $resource->statuses()->create($statusArray);


        $resource = SmokejumperAirplane::where("identifier", "J-89")->first();
        $crew = $resource->crew;
        $user = $crew->users()->first();
        $oldtime = Carbon::now()->subDays(3); // A stale timestamp
        $statusArray = array(
            'statusable_resource_type' => $resource->resource_type,
            'statusable_resource_name' => $resource->identifier,
            'latitude' => 45.281331,
            'longitude' => -116.225388,
            'staffing_value1' => "18",
            'staffing_value2' => "",
            'manager_name' => "Pat Stone",
            'manager_phone' => "530-448-8581",
            'comments1' => "Flying every day since 7/2",
            'comments2' => "",
            'assigned_fire_name' => "Morning Fire",
            'assigned_fire_number' => "MT-FFT-150038",
            'assigned_supervisor' => "Gary Pickett",
            'assigned_supervisor_phone' => "333-444-5555",
            'distance' => 100,
            'label_text' => ".",
            'created_by_name' => $user->name,
            'created_by_id' => $user->id,
            'created_at' => $oldtime,
            'updated_at' => $oldtime,
            'crew_name' => $crew->name,
            'popup_content' => ''
        );
        $statusArray['popup_content'] = $this->createPopupinfo($statusArray);
        $status = $resource->statuses()->create($statusArray);


//        $resource = HotshotCrew::where("identifier", "Prineville Hotshots")->first();
//        $crew = $resource->crew;
//        $user = $crew->users()->first();
//        $oldtime = Carbon::now()->subDays(3); // A stale timestamp
//        $statusArray = array(
//            'statusable_resource_type' => $resource->resource_type,
//            'statusable_resource_name' => $resource->identifier,
//            'latitude' => 45.281331,
//            'longitude' => -111.225388,
//            'staffing_value1' => "3",
//            'staffing_value2' => "4",
//            'manager_name' => "Pat Stone",
//            'manager_phone' => "530-448-8581",
//            'comments1' => "This is update 1 of 1 from the db seeder",
//            'comments2' => "This is upcoming",
//            'assigned_fire_name' => "Morning Fire",
//            'assigned_fire_number' => "MT-FFT-150038",
//            'assigned_supervisor' => "Gary Pickett",
//            'assigned_supervisor_phone' => "333-444-5555",
//            'distance' => 100,
//            'label_text' => ".",
//            'created_by_name' => $user->name,
//            'created_by_id' => $user->id,
//            'created_at' => $oldtime,
//            'updated_at' => $oldtime,
//            'crew_name' => $crew->name,
//            'popup_content' => ''
//        );
//        $statusArray['popup_content'] = $this->createPopupinfo($statusArray);
//        $status = $resource->statuses()->create($statusArray);


    }//End run()

    private function createPopupinfo($status)
    {
        switch ($status['statusable_resource_type']) {
            case ShortHaulHelicopter::resourceType():
                return "<table class=\"popup-table\">
                        <tr>
                            <td class=\"logo-cell\" aria-label=\"Logo\" title=\"Crew Logo\">
                                <img src=\"\"/>
                            </td>

                            <td aria-label=\"Aircraft Info\" title=\"Current manager & aircraft info\">
                                <div class=\"popup-col-header\"><span class=\"glyphicon glyphicon-plane\"></span> HMGB</div>
                                " . $status['manager_name'] . "<br />
                                " . $status['manager_phone'] . "
                            </td>

                            <td aria-label=\"Current Staffing\" title=\"Current staffing levels\">
                                <div class=\"popup-col-header\"><span class=\"glyphicon glyphicon-user\"></span> Staffing</div>
                                <table class=\"staffing_table\">
                                    <tr><td>EMT:</td><td>" . $status['staffing_value1'] . "</td></tr>
                                    <tr><td>HAUL:</td><td>" . $status['staffing_value2'] . "</td></tr>
                                </table>
                            </td>

                            <td aria-label=\"Current Assignment\" title=\"Current assignment & supervisor\">
                                <div class=\"popup-col-header\"><span class=\"glyphicon glyphicon-map-marker\"></span> Assigned</div>
                                " . $status['assigned_fire_name'] . "<br />
                                " . $status['assigned_fire_number'] . "<br />
                                " . $status['assigned_supervisor'] . "<br />
                                " . $status['assigned_supervisor_phone'] . "</td>
                        </tr>
                        <tr>
                            <td class=\"timestamp-cell\" colspan=\"4\">Updated: " . $status['created_at'] . "</td>
                        </tr>
                    </table>";
                break;

            case RappelHelicopter::resourceType():
                return "<table class=\"popup-table\">
                        <tr>
                            <td class=\"logo-cell\" aria-label=\"Logo\" title=\"Crew Logo\">
                                <img src=\"\"/>
                            </td>

                            <td aria-label=\"Aircraft Info\" title=\"Current manager & aircraft info\">
                                <div class=\"popup-col-header\"><span class=\"glyphicon glyphicon-plane\"></span> HMGB</div>
                                " . $status['manager_name'] . "<br />
                                " . $status['manager_phone'] . "
                            </td>

                            <td aria-label=\"Current Staffing\" title=\"Current staffing levels\">
                                <div class=\"popup-col-header\"><span class=\"glyphicon glyphicon-user\"></span> Staffing</div>
                                <table class=\"staffing_table\">
                                    <tr><td>HRAP:</td><td>" . $status['staffing_value1'] . "</td></tr>
                                    <tr><td>Surplus:</td><td>" . $status['staffing_value2'] . "</td></tr>
                                </table>
                            </td>

                            <td aria-label=\"Current Assignment\" title=\"Current assignment & supervisor\">
                                <div class=\"popup-col-header\"><span class=\"glyphicon glyphicon-map-marker\"></span> Assigned</div>
                                " . $status['assigned_fire_name'] . "<br />
                                " . $status['assigned_fire_number'] . "<br />
                                " . $status['assigned_supervisor'] . "<br />
                                " . $status['assigned_supervisor_phone'] . "</td>
                        </tr>
                        <tr>
                            <td class=\"timestamp-cell\" colspan=\"4\">Updated: " . $status['created_at'] . "</td>
                        </tr>
                    </table>";
                break;

            case SmokeJumperAirplane::resourceType():
                return "<table class=\"popup-table\">
                        <tr>
                            <td class=\"logo-cell\" aria-label=\"Logo\" title=\"Crew Logo\">
                                <img src=\"\"/>
                            </td>

                            <td aria-label=\"Aircraft Info\" title=\"Current manager & aircraft info\">
                                <div class=\"popup-col-header\"><span class=\"glyphicon glyphicon-plane\"></span> Spotter</div>
                                " . $status['manager_name'] . "<br />
                                " . $status['manager_phone'] . "
                            </td>

                            <td aria-label=\"Current Staffing\" title=\"Current staffing levels\">
                                <div class=\"popup-col-header\"><span class=\"glyphicon glyphicon-user\"></span> Staffing</div>
                                <table class=\"staffing_table\">
                                    <tr><td>SMKJ:</td><td>" . $status['staffing_value1'] . "</td></tr>
                                </table>
                            </td>

                            <td aria-label=\"Current Assignment\" title=\"Current assignment & supervisor\">
                                <div class=\"popup-col-header\"><span class=\"glyphicon glyphicon-map-marker\"></span> Assigned</div>
                                " . $status['assigned_fire_name'] . "<br />
                                " . $status['assigned_fire_number'] . "<br />
                                " . $status['assigned_supervisor'] . "<br />
                                " . $status['assigned_supervisor_phone'] . "</td>
                        </tr>
                        <tr>
                            <td class=\"timestamp-cell\" colspan=\"4\">Updated: " . $status['created_at'] . "</td>
                        </tr>
                    </table>";
                break;

            case Crew::class:
                $output = "<table class=\"popup-table\">
                        <tr>
                            <td class=\"logo-cell\" aria-label=\"Logo\" title=\"Crew Logo\">
                                <img src=\"\"/>
                            </td>

                            <td aria-label=\"Crew Info\" title=\"Current crew boss & crew info\">
                                <div class=\"popup-col-header\"><span class=\"glyphicon glyphicon-user\"></span> CRWB</div>
                                " . $status['manager_name'] . "<br />
                                " . $status['manager_phone'] . "
                            </td>

                            <td aria-label=\"Current Staffing\" title=\"Current staffing levels\">
                                <div class=\"popup-col-header\"><span class=\"glyphicon glyphicon-user\"></span> Staffing</div>
                                <table class=\"staffing_table\">
                                    <tr><td>Crew size:</td><td>" . $status['staffing_value1'] . "</td></tr>";

                if ($status['comments2'] == "true") $output .= "<tr><td>Available: Yes</td></tr>";
                else $output .= "<tr><td>Available: No</td></tr>";

                $output .= "</table>
                            </td>

                            <td aria-label=\"Current Assignment\" title=\"Current assignment & supervisor\">
                                <div class=\"popup-col-header\"><span class=\"glyphicon glyphicon-map-marker\"></span> Assigned</div>
                                " . $status['assigned_fire_name'] . "<br />
                                " . $status['assigned_fire_number'] . "<br />
                                " . $status['assigned_supervisor'] . "<br />
                                " . $status['assigned_supervisor_phone'] . "
                                Day 1: " . $status['staffing_value2'] . "</td>

                        </tr>
                        <tr>
                            <td class=\"timestamp-cell\" colspan=\"4\">Updated: " . $status['created_at'] . "</td>
                        </tr>
                    </table>";
                return $output;
                break;
        } // End switch()
    } // createPopupinfo()

}
