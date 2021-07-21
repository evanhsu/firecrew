<?php

namespace App\Http\Controllers;

use App\Domain\Aircrafts\Aircraft;
use App\Domain\StatusableResources\AbstractStatusableResource;
use App\Http\Middleware\CapitalizeTailnumber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;


class AircraftController extends Controller
{
    public function __construct()
    {
        // Use the 'CapitalizeTailnumber' middleware to make sure that all
        // tailnumbers extracted from URLs are converted to all caps before
        // they reach the controller logic.
        $this->middleware(CapitalizeTailnumber::class);
    }


    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        $aircrafts = AbstractStatusableResource::orderBy('identifier', 'asc')->get();

        $request->session()->flash('active_menubutton', 'aircraft'); // Tell the menubar which button to highlight
        return view('aircrafts.index')->with('aircrafts', $aircrafts);
    }


    /**
     * @param Request $request
     * @param string $tailnumber
     * @return \Illuminate\Http\JsonResponse
     */
    public function releaseFromCrew(Request $request, $tailnumber)
    {
        // Disassociate the specified aircraft with this Crew (set crew_id = null) if the current user has authorization

        $heli = AbstractStatusableResource::where('identifier', $tailnumber)->first();

        if (empty($heli)) {
            // Aircraft not found. Nothing to release. Consider this success.
            return response()->json(['status' => 'success']);
        } else {
            // Make sure the current user is authorized to release this aircraft
            // Also make sure that this 'release' request was sent from the 'Edit Crew' form of the Crew that currently owns the aircraft
            $user = Auth::user();
            $requesting_crew = $request->input('sent-from-crew');
            $affected_crew = $heli->crew_id;

            if ($user->isAdminForCrew($heli->crew_id) && ($requesting_crew == $affected_crew)) {
                if ($heli->release()) return response()->json(['status' => 'success']);
                else abort(500); //Something prevented the aircraft from being released
            } else {
                // Unauthorized
                abort(401, "Unauthorized");
            }
        }

    }

    /**
     * Show the most recent Status for this Aircraft
     * @param $tailnumber
     * @return $this|string
     */
    public function showCurrentStatus($tailnumber)
    {

        $aircraft = Aircraft::findOrFail($tailnumber);

        // Make sure this user is authorized...
        if (Gate::denies('act-as-admin-for-crew', $aircraft->crew_id)) {
            // The current user does not have permission to perform admin functions for this crew
            return redirect()->back()->withErrors("You're not authorized to access that aircraft !");
        }
        // Authorization complete - continue...
        return "Showing most recent Status for Aircraft " . $tailnumber;
    }

    /**
     * Display the Aircraft Status update form
     * Note: this form POSTS its response to the StatusController
     * @param Request $request
     * @param $tailnumber
     * @return $this
     */
//    public function newStatus(Request $request, $tailnumber)
//    {
//        // Determine the subclass for this Aircraft (Shorthaulhelicopter, Rappelhelicopter, Smokejumperairplane, etc)
//        $aircraft = Aircraft::where('tailnumber', '=', $tailnumber)->first();
//        if (is_null($aircraft)) {
//            return "Aircraft not found";
//        }
//        $aircraft = $aircraft->subclass(); // Instantiate a child class (Rappelhelicopter, for example) NOT the parent "Aircraft" class
//
//        // Make sure this user is authorized...
//        if (Gate::denies('act-as-admin-for-crew', $aircraft->crew_id)) {
//            // The current user does not have permission to perform admin functions for this crew
//            return redirect()->back()->withErrors("You're not authorized to access that aircraft!");
//        }
//        // Authorization complete - continue...
//
//        // Retrieve the other Aircrafts that are owned by the same Crew (to build a navigation menu)
//        $crew = $aircraft->crew;
//        $aircraft_class = $aircraft->classname();
//        $crew_aircrafts = $aircraft_class::where('crew_id', $aircraft->crew_id)->orderBy('tailnumber')->get();
//
//        // Retrieve the most recent status update to prepopulate the form (returns a 'new Status' if none exist)
//        $last_status = $aircraft->status();
//
//        // Convert the lat and lon from decimal-degrees into decimal-minutes
//        // MOVE THIS FUNCTIONALITY INTO A COORDINATES CLASS
//        if (!empty($last_status->latitude)) {
//            $sign = $last_status->latitude >= 0 ? 1 : -1; // Keep track of whether the latitude is positive or negative
//            $last_status->latitude_deg = floor(abs($last_status->latitude)) * $sign;
//            $last_status->latitude_min = round((abs($last_status->latitude) - $last_status->latitude_deg) * 60.0, 4);
//
//        } else {
//            $last_status->latitude_deg = "";
//            $last_status->latitude_min = "";
//        }
//
//        if (!empty($last_status->longitude)) {
//            $sign = $last_status->longitude >= 0 ? 1 : -1; // Keep track of whether the longitude is positive or negative
//            $last_status->longitude_deg = floor(abs($last_status->longitude)) * $sign * -1; // Convert to 'West-positive' reference
//            $last_status->longitude_min = round((abs($last_status->longitude) - $last_status->longitude_deg) * 60.0, 4);
//        } else {
//            $last_status->longitude_deg = "";
//            $last_status->longitude_min = "";
//        }
//
//        // Display the status update form
//        if (Auth::user()->isGlobalAdmin()) {
//            $request->session()->flash('active_menubutton', 'aircraft'); // Tell the menubar which button to highlight
//        } else {
//            $request->session()->flash('active_menubutton', 'status'); // Tell the menubar which button to highlight
//        }
//        // return view('aircrafts.new_status')->with("aircraft",$aircraft)->with("aircrafts",$crew_aircrafts)->with("status",$last_status)->with("crew",$crew);
//        $resource_type = $crew->statusable_type_plain();
//        return view('status_forms.' . $resource_type)->with("aircraft", $aircraft)->with("aircrafts", $crew_aircrafts)->with("status", $last_status)->with("crew", $crew);
//        // return view('status_forms.shorthaulhelicopter')->with("aircraft",$aircraft)->with("aircrafts",$crew_aircrafts)->with("status",$last_status)->with("crew",$crew);
//
//        // return var_dump($aircraft);
//        // return var_dump($last_status);
//    }
}
