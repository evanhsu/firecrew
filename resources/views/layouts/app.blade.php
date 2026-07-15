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

    @yield('stylesheets')

<!-- Scripts -->
    <script>
        window.Laravel = {!! json_encode([
            'csrfToken' => csrf_token(),
            'nav' => $nav ?? null,
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
    <div id="react-shell"></div>

    <div id="app-content" class="app-content @yield('app-content-class', '')">
        @if (Session::has('alert'))
            <div class="alert alert-{{ isset(Session::get('alert')['type']) ? Session::get('alert')['type'] : 'info' }}"
                 style="margin-bottom: 0"
                 role="alert"
            >
                {{ Session::get('alert')['message'] }}
            </div>
        @endif

        @yield('content')
        <div class="clearfix"></div>
    </div>
</div>

@section('scripts-postload')
    @viteReactRefresh
    @vite(['resources/sass/app.scss', 'resources/js/index.tsx'])
@show

</body>
</html>
