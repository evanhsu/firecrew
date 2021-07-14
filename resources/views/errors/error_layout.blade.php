@extends('layouts.app')

@section('title','FireCrew')

@section('content')
<div class="container-fluid fullscreen http-404-bg">
    <div class="row">
        <div class="col-sm-12 http-error-container">
            <span class="http-error-code">@yield('error-heading')</span>
            <span class="http-error-text">@yield('error-text')</span>
        </div>
    </div>
</div>
@endsection