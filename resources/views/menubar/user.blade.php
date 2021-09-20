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
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                    data-target=".navbar-collapse" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <!-- Branding Image -->
            <a class="navbar-brand" href="{{ url('/') }}">
                <!-- <img class="navbar-logo" src="{{ asset('images/firecrew_logo_800x400.png') }}" title="Firecrew" /> -->
                FireCrew
            </a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li<?php is_active('map', $a); ?>><a href="{{ route('map') }}">Map</a></li>
                <li<?php is_active('summary', $a); ?>><a href="{{ route('summary') }}">Summary</a></li>
                <li<?php is_active('status', $a); ?>><a href="{{ route('new_status_for_crew', ['crewId' => $user_crew_id]) }}">Status</a></li>
                <li<?php is_active('identity', $a); ?>><a href="{{ route('edit_crew', ['crewId' => $user_crew_id]) }}">Identity</a></li>
                <li<?php is_active('accounts', $a); ?>><a href="{{ route('users_for_crew', ['crewId' => $user_crew_id]) }}">Accounts</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                        {{ Auth::user()->name }} <span class="caret"></span>
                    </a>

                    <ul class="dropdown-menu" role="menu">
                        <li>
                            <a href="{{ route('edit_user_me') }}">My Account</a>
                        </li>
                        <li>
                            <a href="{{ route('logout') }}"
                               onclick="event.preventDefault(); document.getElementById('logout-form').submit();"
                            >
                                Logout
                            </a>

                            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                {{ csrf_field() }}
                            </form>
                        </li>
                    </ul>
                </li>

            </ul>
        </div><!--/.nav-collapse -->
    </div>
</nav>