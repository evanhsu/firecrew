<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     * @return \Illuminate\Http\RedirectResponse
     */
//    protected $redirectTo = '/';
    protected function authenticated(Request $request, $user)
    {
        return $this->redirectToLandingPage($user);
    }

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest', ['except' => 'logout']);
    }

    /**
     * Show the application's login form.
     * This overrides the 'showLoginForm()' method in the 'AuthenticatesUsers' trait.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function showLoginForm(Request $request)
    {
        $request->session()->flash('active_menubutton', 'login'); // Tell the menubar which button to highlight
        return view('auth.login');
    }

    protected function redirectToLandingPage(User $user)
    {
        // Determine what page the current user should land on after a successful login.

        if ($user->isGlobalAdmin()) {
            // If this user is an Admin, land on the list of all Crews (Crews@getIndex)
            return redirect()->route('crews_index');
        } else if (!is_null($user->crew_id)) {
            return redirect()->route('new_status_for_crew', $user->crew_id);
        } else {
            // The $user is not a GlobalAdmin, nor does he belong to a Crew (this shouldn't happen).
            // Delete the user and display a message.
            // (If the User is not deleted, a new account using the same email cannot be created and a Global Admin
            //  will need to intervene to change the Crew for an existing User).

            $user->delete();
            return redirect()->back()->withErrors("Your crew has been removed from the system. Contact an admin for support.");
        }
    }

}
