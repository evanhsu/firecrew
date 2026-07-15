@extends('layouts.app')

@section('page-title','Login - FireCrew')
@section('page-description','Log in to post status updates and manage your account')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2" id="login-wrapper">
            <div class="panel panel-default">
                <div class="panel-heading">Login</div>
                <div class="panel-body">
                    <form class="form-horizontal" role="form" method="POST" id="login-form" action="{{ route('login') }}">
                        {{ csrf_field() }}

                        <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                            <label for="email" class="col-md-4 control-label">E-Mail Address</label>

                            <div class="col-md-6">
                                <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required autofocus autocomplete="username">

                                @if ($errors->has('email'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">
                            <label for="password" class="col-md-4 control-label">Password</label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control" name="password" required autocomplete="current-password">

                                @if ($errors->has('password'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('password') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-6 col-md-offset-4">
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}> Remember Me
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-8 col-md-offset-4">
                                <button type="submit" id="login-button" class="btn btn-primary">
                                    Login
                                </button>

                                <a class="btn btn-link" href="{{ route('password.request') }}">
                                    Forgot Your Password?
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts-postload')
    @parent
    <script src="https://smartlock.google.com/client"></script>
    <script>
        const googleyoloSettings = {
            supportedAuthMethods: [
                "https://accounts.google.com",
                "googleyolo://id-and-password"
            ],
            supportedIdTokenProviders: [
                {
                    uri: "https://accounts.google.com",
                    clientId: "228164714370-2745qoggaalgtjt382h4g2ll2kpclo66.apps.googleusercontent.com"
                }
            ]
        };

        document.addEventListener('DOMContentLoaded', () => {
            let emailField = document.getElementById('email');
            let passwordField = document.getElementById('password');
            let form = document.getElementById('login-form');

            form.addEventListener('submit', () => {
                storeCredentials();
            });

            if(navigator.credentials && navigator.credentials.preventSilentAccess) {            
                navigator.credentials.get({
                    password: true,
                }).then((credentials) => {
                    signInWithEmailAndPassword(credentials.id, credentials.password);
                });
            }

        });

        function storeCredentials() {

            if(navigator.credentials && navigator.credentials.preventSilentAccess) {
                let emailField = document.getElementById('email');
                let passwordField = document.getElementById('password');

                const cred = new PasswordCredential({
                    id: emailField.value,
                    password: passwordField.value,
                });

                navigator.credentials.store(cred);
            }
        }

        window.onGoogleYoloLoad = (googleyolo) => {
        }

        function signInWithEmailAndPassword(email, password) {
            let emailField = document.getElementById('email');
            let passwordField = document.getElementById('password');

            emailField.value = email;
            passwordField.value = password;
        }

        function useGoogleIdTokenForAuth(idToken) {
            console.log('using Google ID Token...');
        }
    </script>
@endsection
