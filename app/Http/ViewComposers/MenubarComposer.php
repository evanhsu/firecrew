<?php namespace App\Http\ViewComposers;

use Exception;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class MenubarComposer
{
    protected $menubar_type;
    protected $active_menubutton;
    protected $crew_id;

    public function __construct(Request $request)
    {
        try {
            $this->active_menubutton = $request->session()->get('active_menubutton');
        } catch (Exception $e) {
            // There's probably no session associated with this request (maybe it's an error page, 404, 500, etc.)
        }

        if (Auth::check()) {
            if (Auth::user()->isGlobalAdmin()) {
                $this->menubar_type = 'admin';
                $this->crew_id = null;
            } else {
                $this->menubar_type = 'user';
                $this->crew_id = Auth::user()->crew_id;
            }
        } else {
            $this->menubar_type = 'guest';
            $this->crew_id = null;
        }
    }

    public function compose(View $view)
    {
        $crewId = $this->crew_id;

        $nav = [
            'type' => $this->menubar_type,
            'active' => $this->active_menubutton ?? '',
            'userName' => Auth::check() ? Auth::user()->name : null,
            'crewId' => $crewId,
            'routes' => [
                'home' => url('/'),
                'map' => route('map'),
                'summary' => route('summary'),
                'login' => url('/login'),
                'logout' => route('logout'),
                'editUserMe' => route('edit_user_me'),
                'crewsIndex' => route('crews_index'),
                'aircraftIndex' => route('aircraft_index'),
                'usersIndex' => route('users_index'),
                'privacy' => url('/privacy'),
                'newStatus' => $crewId ? route('new_status_for_crew', ['crewId' => $crewId]) : null,
                'editCrew' => $crewId ? route('edit_crew', ['crewId' => $crewId]) : null,
                'crewAccounts' => $crewId ? route('users_for_crew', ['crewId' => $crewId]) : null,
            ],
        ];

        $view->with([
            'menubar_type' => $this->menubar_type,
            'active_menubutton' => $this->active_menubutton,
            'user_crew_id' => $this->crew_id,
            'nav' => $nav,
        ]);
    }
}
