<?php

namespace App\Http\Controllers\Auth;

use App\Domain\Crews\Crew;
use App\Domain\Users\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);
    }

    /**
     * Show the "Create New User" form.
     *
     * @param Request $request
     * @param $crewId
     * @return \Illuminate\Http\Response
     */
    public function getRegister(Request $request, $crewId)
    {
        $crew = Crew::findOrFail($crewId);
        if(Auth::user()->cannot('act-as-admin-for-crew', $crew)) {
            // The current user does not have permission to register a user for the specified crew
            return redirect()->back()->withErrors("You're not authorized to register users for that crew!");
        }

        // Authorization complete - continue...
        $request->session()->flash('active_menubutton','accounts'); // Tell the menubar which button to highlight
        return view('auth.new_user')->with("crewId",$crewId);
    }




    /**
     * Register a new user from the signup form. This user is signing themselves up.
     *
     * @param Request $request
     */
    public function postRegister(Request $request)
    {
        abort(501, "Self-signup is not implemented");
    }

    /**
     * Create a new user instance AFTER a valid registration.
     * This action is protected and is called from the 'postRegister' action.
     *
     * @param  array  $data
     * @return User|null
     */
    protected function create(array $data)
    {
        // TODO: Change this to generate a random password and send it to the user in an email.
        // $password = $this->randomPassword();

        $user = User::create([
            'firstname' => $data['firstname'],
            'lastname'  => $data['lastname'],
            'email'     => $data['email'],
            'encrypted_password' => Hash::make($data['password']),
            'crew_id'   => $data['crew_id'],
        ]);

        if(!$user) {
            return null;
        }

        // Send WELCOME email to new user, including the randomly-generated password
        // sendEmail($new_user, $new_user_data['password']);

        return $user;

    }
}
