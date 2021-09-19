@extends('layouts.app')

@section('page-title','Login - FireCrew')
@section('page-description','Log in to post status updates and manage your account')

@section('content')
    <div id="container-fluid" class="container-fluid background-container">
        <div id="login-window">
            <div class="alert alert-danger" style="margin-top:-40px;
        @if ($error = $errors->first('password'))
                ">
                {{ $error }}
                @else
                    visibility:hidden;">&nbsp;
                @endif

            </div>
            <form id="login-form" class="form-vertical" role="form" action="/login" method="post">
                <div class="form-group" style="margin-bottom:5px;">
                    <label class="control-label sr-only" for="email">Email:</label>
                    <input type="email" class="form-control" id="email" name="email" placeholder="Email" value="{{ old('email') }}" />

                </div>

                <div class="form-group">
                    <label class="control-label sr-only" for="password">Password:</label>
                    <input type="password" class="form-control" id="password" name="password" placeholder="Password" />
                    <div id="forgot-password"><a href="/resetpassword">Forgot Password</a></div>
                </div>

                <div class="form-group">
                    {!! csrf_field() !!}
                    <button type="submit" class="btn btn-default">Login</button>
                </div>

        </div> <!-- /loginWindow -->
    </div>
@endsection
