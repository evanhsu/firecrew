@extends('layouts.app')

@section('page-title','Map2 - FireCrew')
@section('page-description','View fire resources on the map with their staffing intel.')

@section('stylesheets')
    @parent
    <link rel="stylesheet" href="https://js.arcgis.com/4.25/@arcgis/core/assets/esri/themes/light/main.css">
@endsection

@section('content')
    <div id="map-root"></div>
@endsection

@section('scripts-postload')
    <script src="{{ mix('/js/manifest.js') }}"></script>
    <script src="{{ mix('/js/vendor.js') }}"></script>
    <script src="{{ mix('/js/index.js') }}"></script>
@endsection