<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" type="application/manifest+json" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#00a300">
    <meta name="theme-color" content="#804949">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('page-title')</title>
    <meta name="description" content="@yield('page-description')">

    <!-- Styles -->
    <link rel="stylesheet" href="{{ mix('/css/app.css') }}">
@yield('stylesheets')

<!-- Scripts -->
    <script>
        window.Laravel = {!! json_encode([
            'csrfToken' => csrf_token(),
            'pusher' => [
                'appKey' => env('PUSHER_APP_KEY'),
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'encrypted' => env('PUSHER_APP_ENCRYPTED'),
            ],
        ]) !!};
    </script>

@if(App::environment('production'))
    <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-114289907-1"></script>
        <script>
            window.dataLayer = window.dataLayer || [];

            function gtag() {
                dataLayer.push(arguments);
            }

            gtag('js', new Date());
            gtag('config', 'UA-114289907-1');
        </script>
    @endif

    @section('scripts-preload')

    @show
</head>
<body>
<div id="app">
    @include('menubar')

    @if (Session::has('alert'))
        <div class="alert alert-{{ isset(Session::get('alert')['type']) ? Session::get('alert')['type'] : 'info' }}"
             style="margin-bottom: 0"
             role="alert"
        >
            {{ Session::get('alert')['message'] }}
        </div>
    @endif

    @yield('content')
    <div class="clearfix" style=""></div>
</div>

@section('scripts-postload')
    <script
        src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,es6,fetch"></script>{{-- Polyfills for the Google crawler --}}
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
    <script src="{{ mix('/js/app.js') }}"></script>
@show

</body>
</html>
