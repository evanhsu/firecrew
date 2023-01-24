<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

Class MapController extends Controller
{
    public function getMap(Request $request)
    {
        // Display the main map page.
        // The menubar will be selected by the MenubarComposer (app/Http/ViewComposers/MenubarComposer.php)
        $request->session()->flash('active_menubutton', 'map'); // Tell the menubar which button to highlight
        return view('map');
    } // End getMap()

    public function getMap2(Request $request)
    {
        // The menubar will be selected by the MenubarComposer (app/Http/ViewComposers/MenubarComposer.php)
        $request->session()->flash('active_menubutton', 'map'); // Tell the menubar which button to highlight
        return view('map2');
    }

    public function getMapJSON()
    {
        /**
         *   This will return a JSON array of all statusable features with their attached location data & contact info
         *
         *   $data = $helicopter->jsonDump();
         *   $data = {
         *               "helicopters" : {
         *                   "tailnumber"    : "N12345",
         *                   "crew_id"       : "1",
         *                   "staffing_emt"  : "8",
         *                   "latitude"      : "42.67893",
         *                   "longitude"     : "-123.89409"
         *               }
         *           };
         *
         */
        return response()->json(array('aircrafts' => array(array('tailnumber' => "N12345",
            'crew_id' => '1',
            'latitude' => '42.67893',
            'longitude' => '-123.89409'))));
    } // End getMapJSON()
}
