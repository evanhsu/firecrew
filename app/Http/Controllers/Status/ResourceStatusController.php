<?php

namespace App\Http\Controllers\Status;

use App\Events\ResourceStatusUpdated;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Domain\Crews\Crew;
use App\Domain\Statuses\ResourceStatus;
use Illuminate\Support\Facades\Log;


class ResourceStatusController extends Controller
{
    /**
     * This function responds to AJAX requests from the map to update all resources
     *
     * @return \Illuminate\Http\Response
     */
    public function currentForAllResources()
    {
        $max_age = config('app.days_until_updates_expire');
        $earliest_date = Carbon::now()->subDays($max_age); // The oldest Status that will be displayed

        $resources = DB::table('resource_statuses as newest')
                        ->leftjoin('resource_statuses as newer', function($join) {
                            $join->on('newer.statusable_resource_id','=','newest.statusable_resource_id');
                            $join->on('newer.updated_at','>','newest.updated_at');
                            })
                        ->join('statusable_resources', 'statusable_resources.id', '=', 'newest.statusable_resource_id')
                        ->select('newest.*', 'statusable_resources.crew_id')
                        ->whereNotNull('statusable_resources.crew_id')
                        ->whereNull('newer.updated_at')
                        ->where('newest.updated_at','>=',$earliest_date)
                        ->get();

        return json_encode($resources);
    }

    /**
     * Store a newly created ResourceStatus in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param $crewId
     * @param string    $identifier   The StatusableResource->identifier
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $crewId, $identifier)
    {
        $resourceClass = "App\Domain\StatusableResources\\" . $request->get('statusable_resource_type');
        $resource = $resourceClass::where('identifier', $identifier)->first();
        $crew = Crew::find($crewId);

        Log::info("Updating status for resource $identifier of Crew $crew->name");
        

        // Make sure current user is authorized
        if(Auth::user()->cannot('act-as-admin-for-crew', $crewId)) {
            // The current user does not have permission to perform admin functions for this crew
            return redirect()->back()->withErrors("You're not authorized to update that crew!");
        }

        if($resource->crew_id != $crewId) {
            // This status update refers to a resource that is owned by a different crew
            return redirect()->back()->withErrors("You're not authorized to update '$identifier'!");
        }

        // This User is authorized - continue...

        $this->validate($request, [
            'latitude_deg' => 'required',
            'latitude_min' => 'required',
            'longitude_deg' => 'required',
            'longitude_min' => 'required'
            ]);

        $latitude_dd = $this->decMinToDecDeg($request->get('latitude_deg'), $request->get('latitude_min'));
        $longitude_dd = $this->decMinToDecDeg($request->get('longitude_deg'), $request->get('longitude_min')) * -1.0; // Convert to 'Easting' (Western hemisphere is negative)

        // Form is valid, continue...
        $status = new ResourceStatus($request->all());

        // Add a period to the LabelText field - this is a a workaround for the ArcGIS server to be able to render a buffer around the shorthaulhelicopter features
        $status->label_text = ".";

        // Insert the identity of the User who created this Status update (the CURRENT user):
        $status->created_by_name = Auth::user()->name;
        $status->created_by_id = Auth::user()->id;

        // Insert the name of the Crew that owns this Status update (if this Status refers to a Crew, then 'crew_name' will be the same as 'statusable_name')
        $status->crew_name = $crew->name;

        // Insert the lat and lon in decimal-degree format
        $status->latitude = $latitude_dd;
        $status->longitude = $longitude_dd;

        $status->created_at = date('Y-m-d H:i:s'); // Temporarily set the timestamp so that it can be included in the popup (timestamp will be reset when $status is saved)

        // Build the HTML popup that will be displayed when this feature is clicked
        $status->popup_content = $this->generatePopup($status, $crew);

        // Attempt to save
        if($resource->statuses()->save($status)) {
            // Fire an event
            event(new ResourceStatusUpdated($status));

            return redirect()->back()->with('alert', array('message' => 'Status update saved!', 'type' => 'success'));
        }
        return redirect()->back()->with('alert', array('message' => 'Status update failed!', 'type' => 'danger'));
    }


    private function generatePopup($status, $crew, $folder = "local") {
        // Constructs the HTML that will be displayed when this Update Feature is clicked on the map view
        // The HTML string must be stored in this object's 'popup_content' property, which corresponds directly with a database field
        // that is used by the ArcGIS server to generate the popup for each Feature.
        //
        // This function relies on a Blade view template existing in the /resources/views/map_popups/ folder for each Class that
        // can have a status (e.g. Shorthaulhelicopter.blade.php, etc)
        //
        // $folder designates the subfolder within the /views/map_popups/ folder that will be searched for a matching View template.
        // This allows a different View to be rendered for local display versus the one that sent to the EGP database.
        //
        // All properties of the Status object must be defined before calling this method.
        $v = view('map_popups.'.$folder.".".$status->statusable_resource_type)->with("status",$status)->with("crew",$crew)->render();
        $v_no_whitespace = preg_replace('/\s+/', ' ', $v); // Remove line-breaks, new-line and repeated spaces

        return $v_no_whitespace;
    }

    protected function decMinToDecDeg($deg, $min) {
        // Convert a latitude or longitude from DD MM.MMMM (decimal minutes)
        // to DD.DDDDD (decimal degrees) format
        return round(($deg * 1.0) + ($min / 60.0), 6);
    }
}
