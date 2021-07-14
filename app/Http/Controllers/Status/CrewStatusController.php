<?php

namespace App\Http\Controllers\Status;

use App\Domain\Crews\Crew;
use App\Domain\Statuses\Coordinate;
use App\Domain\Statuses\CrewStatus;
use App\Domain\Statuses\ResourceStatus;
use App\Events\CrewStatusUpdated;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class CrewStatusController extends Controller
{
    /**
     * Display the Crew Status update form
     * Note: this form POSTS its response to the StatusController
     *
     * @param Request $request
     * @param $crewId
     * @param null $tailnumber
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Http\RedirectResponse|\Illuminate\View\View
     */
    public function newStatus(Request $request, $crewId, $tailnumber = null)
    {
        // Retrieve the requested Crew with the latest CrewStatus
        $crew = Crew::findOrFail($crewId);

        // Make sure this user is authorized...
        if (Gate::denies('act-as-admin-for-crew', $crewId)) {
            return redirect()->back()->withErrors("You're not authorized to update that crew's status!");
        }

        // Retrieve the most recent status update to prepopulate the form (returns a 'new Status' if none exist)
        $crew->load('status');
        if(is_null($crew->status)) {
            $crew->status = new CrewStatus();
        }
        $resources = $crew->resourcesWithLatestStatus;

        // Convert the lat and lon from decimal-degrees into decimal-minutes
        $modifiedResources = $resources->map(function ($resource, $index) {
            $resource = $resource->toSubclass();

            if(is_null($resource->latestStatus)) {
                $resource->latestStatus = new ResourceStatus();
            }
            $coords = (new Coordinate($resource->latestStatus->latitude, $resource->latestStatus->longitude))->asDecimalMinutes();
            $resource->latestStatus->latitude_deg = $coords['latitude']['degrees'];
            $resource->latestStatus->latitude_min = $coords['latitude']['minutes'];
            $resource->latestStatus->longitude_deg = $coords['longitude']['degrees'];
            $resource->latestStatus->longitude_min = $coords['longitude']['minutes'];
            return $resource;
        });


        // Authorization complete - continue...
        // Display the status update form
        if (Auth::user()->isGlobalAdmin()) {
            $request->session()->flash('active_menubutton', 'crews'); // Tell the menubar which button to highlight
        } else {
            $request->session()->flash('active_menubutton', 'status'); // Tell the menubar which button to highlight
        }

        return view('status_forms/status')->with('crew', $crew)->with('resources', $modifiedResources)->with('tailnumber', $tailnumber);
    }


    /**
     * Redirect to either:
     *   - The Crew Status Update form (CrewController@newStatus)
     *   - The Aircraft Status Update form for the most-recently updated aircraft that this Crew owns (AircraftController@newStatus)
     *
     * @param $id
     * @return $this|\Illuminate\Http\RedirectResponse
     */
    public function redirectToStatusUpdate($id)
    {

        // Make sure this user is authorized...
        /*  if(Auth::user()->cannot('act-as-admin-for-crew', $id)) {
                // The current user does not have permission to perform admin functions for this crew
                return redirect()->back()->withErrors("You're not authorized to access that crew!");
            }
        */
        // Authorization complete - continue...
        $crew = Crew::findOrFail($id);

        // Decide where to redirect in the following order:
        //   1. Go to a New Status for the resource that was most-recently updated by this user.
        //   2. If the Crew is statusable, go to the New Status form for the crew.
        //   3. If the Crew has aircrafts that are statusable, go to the New Status form for the Aircraft with highest alphabetical priority.
        //   4. If the Crew is supposed to have statusable aircrafts but none are assigned, go to the Edit Crew form with an error message.

        // Step 1
        $user = Auth::user();
        $last_status_from_user = $user->lastStatus();

        if (!is_null($last_status_from_user) && Gate::allows('act-as-admin-for-crew', $last_status_from_user->crewToUpdate())) {
            $route_params = $last_status_from_user->redirectToNewStatus();
            return redirect()->route($route_params['route_name'], $route_params['id']);
        } // Step 2
        elseif ($crew->is_not_an_aircraft_crew()) {
            return redirect()->route('new_status_for_crew', $id);
        } // Step 3|4
        elseif ($crew->is_an_aircraft_crew()) {
            // Look for the first Aircraft owned by this Crew
            $aircraft = $crew->aircrafts()->orderBy('tailnumber')->first();
            if (is_null($aircraft)) {
                // Step 4 (This crew is supposed to have aircrafts, but none were found)
                return redirect()->route('edit_crew', $id)->withErrors("You must add an aircraft to your crew before you can post a status update.");
            } else {
                // Step 3 (This crew has at least one aircraft)
                return redirect()->route('new_status_for_aircraft', $aircraft->tailnumber);
            }
        } else {
            // This crew has a statusable_entity OTHER than 'crew' or 'aircraft'
            // THIS FUNCTIONALITY STILL NEEDS TO BE CREATED
            return redirect()->route('edit_crew', $id)->withErrors("This Crew type hasn't been implemented yet - CrewController@redirectToStatusUpdate");
        }
    }

    /**
     * Receive a post request from the Crew Status form (Intel) and create a new CrewStatus.
     *
     * @param Request $request
     * @param $crewId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, $crewId)
    {
        $crew = Crew::findOrFail($crewId);
        $status = new CrewStatus($request->all());

        $status->created_by_name = Auth::user()->name;
        $status->created_by_id = Auth::user()->id;

         // Attempt to save
        if($crew->statuses()->save($status)) {

            // Fire an event
            event(new CrewStatusUpdated($status));

            return redirect()->back()->with('alert', array('message' => 'Status update saved!', 'type' => 'success'));
        }
        return redirect()->back()->with('alert', array('message' => 'Status update failed!', 'type' => 'danger'));
    }
}