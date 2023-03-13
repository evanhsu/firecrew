<?php
$a = strtolower($active_menubutton);

if (!function_exists('is_active')) {
    function is_active($button, $active_menubutton) {
        // Decide whether to style the requested menu link with the "active" class
        // The $active_menubutton variable is set in the MenubarComposer
        echo ($button == $active_menubutton) ? " class=\"active\"" : "";
    }
}
?>

<nav class="navbar navbar-default navbar-static-top">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse"
                    aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="{{ url('/') }}">
                <!-- <img class="navbar-logo" src="{{ asset('images/firecrew_logo_800x400.png') }}" title="Firecrew" /> -->
                FireCrew
            </a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li<?php is_active('map', $a); ?>><a href="{{ route('map') }}">Map</a></li>
                <li<?php is_active('summary', $a); ?>><a href="{{ route('summary') }}">Summary</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li<?php is_active('login', $a); ?>><a href="/login">Login</a></li>
            </ul>
        </div><!--/.nav-collapse -->
    </div>
</nav>