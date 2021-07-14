<?php

namespace App\Http\Controllers\Crew;

use App\Domain\Crews\Crew;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Domain\Users\User;


/**
 * Class CrewAccountController
 * @package App\Http\Controllers\Crew
 */
class CrewAccountController extends Controller
{
    /**
     * Display all User Accounts for a specified Crew
     *
     * @param Request $request
     * @param $crewId
     * @return \Illuminate\View\View
     */
    public function index(Request $request, $crewId)
    {
        if (Gate::denies('act-as-admin-for-crew', $crewId)) {
            // The current user does not have permission to perform admin functions for this crew
            return redirect()->back()->withErrors("You're not authorized to access that crew!");
        }

        // Authorization complete - continue...
        $crew = Crew::findOrFail($crewId);
        $users = User::where('crew_id', $crewId)
            ->orderBy('name', 'asc')
            ->get();

        $request->session()->flash('active_menubutton', 'accounts'); // Tell the menubar which button to highlight
        return view('crews.accounts', [
            'crew' => $crew,
            'users' => $users,
        ]);
    }
}
