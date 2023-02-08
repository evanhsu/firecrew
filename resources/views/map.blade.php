@extends('layouts.app')

@section('page-title','Map - FireCrew')
@section('page-description','View fire resources on the map with their staffing intel.')

@section('stylesheets')
    @parent
    <link rel="stylesheet" href="https://js.arcgis.com/4.25/@arcgis/core/assets/esri/themes/light/main.css">
@endsection

@section('content')
    <div id="map-root"></div>
@endsection

@section('scripts-postload')
    <script src="{{ mix('/js/map/bundle.js') }}"></script>
@endsection