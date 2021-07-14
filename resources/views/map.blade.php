@extends('layouts.app')

@section('page-title','Map - FireCrew')
@section('page-description','View fire resources on the map with their staffing intel.')

@section('stylesheets')
    @parent
    <link rel="stylesheet" href="https://js.arcgis.com/3.14/esri/css/esri.css">
@endsection


@section('scripts-preload')
    @parent
    <script>
        // Tell Dojo where to find custom modules for the ArcGIS API
        var dojoConfig = {
            locale: "en",
            packages: [{
                name: "js",
                location: "/js"
            }]
        };
    </script>
@endsection


@section('content')
    <div id="content" class="container-fluid">
        <div id="mapDiv">
        <!-- ArcMap gets placed here -->
        </div> <!-- /mapDiv -->
        <div id="legendContainer">
            <div id="legendDiv"></div>
        </div>
        <button type="button" class="btn btn-default" id="legendToggler">
            <span id="left-arrow" class="glyphicon glyphicon-triangle-left" style="display:none"></span>
            <span id="right-arrow" class="glyphicon glyphicon-triangle-right"></span>
            Layers
        </button>
    </div>
@endsection

@section('scripts-postload')
    @parent
    <script src="https://js.arcgis.com/3.14/init.js"></script>  <?php /* ArcGIS API - must load before other classes */?>
    {{--<script src="/js/esri/init.js"></script>--}}
    <script>
        $(document).ready(function() {
            $('#legendToggler').click(function() {
                $('#legendDiv').toggle("fast");
                $('#left-arrow').toggle();
                $('#right-arrow').toggle();
            });
            $('#legendDiv').click(function() {
                $('#legendDiv').toggle("fast");
                $('#left-arrow').toggle();
                $('#right-arrow').toggle();
            });
        });

    </script>
    <script src="{{ asset('/js/localmap.js') }}"></script>
@endsection