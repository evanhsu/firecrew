@extends('layouts.app')

@section('stylesheets')
<!-- <link rel="stylesheet" href="/css/react-drawer.css"> -->
@endsection

@section('content')
<div class="container-fluid">
    <div class="row" id="react-root"></div>
</div>
@endsection

@section('scripts-postload')
<script src="{{ mix('/js/index.js') }}"></script>
@endsection
