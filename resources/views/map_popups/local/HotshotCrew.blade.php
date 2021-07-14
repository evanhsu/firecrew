<?php
// views/map_popups/local/hotshotcrew.blade.php
//
// This file contains the HTML that will be displayed in a popup box when a Hotshot Crew
// feature is clicked on the ResourceBeacon map.
//
// $status is a Status object that must be passed to this view by the controller.
?>
<table class="popup-table">
    <tr>
        <td class="logo-cell" aria-label="Logo" title="Crew Logo">
            @if (file_exists(public_path('images/'.$crew->logo_filename)))
                <img src="{{ asset('images/'.$crew->logo_filename) }}"/>
            @endif
        </td>

        <td aria-label="Crew Info" title="Current crew boss & crew info">
            <div class="popup-col-header"><span class="glyphicon glyphicon-user"></span> CRWB</div>
            {{ $status->manager_name }}<br />
            {{ $status->manager_phone }}
        </td>

        <td aria-label="Current Staffing" title="Current staffing levels">
            <div class="popup-col-header"><span class="glyphicon glyphicon-user"></span> Staffing</div>
            <table class="staffing_table">
                <tr><td>Crew size:</td><td>{{ $status->staffing_value1 }}</td></tr>
                @if($status->comments2)
                <tr><td>Available: Yes</td></tr>
                @else
                <tr><td>Available: No</td></tr>
                @endif
            </table>
        </td>

        <td aria-label="Current Assignment" title="Current assignment & supervisor">
            <div class="popup-col-header"><span class="glyphicon glyphicon-map-marker"></span> Assigned</div>
            {{ $status->assigned_fire_name }}<br />
            {{ $status->assigned_fire_number }}<br />
            {{ $status->assigned_supervisor }}<br />
            {{ $status->assigned_supervisor_phone }}
            Day 1: {{ $status->staffing_value2 }}</td>

    </tr>
    <tr>
        <td class="timestamp-cell" colspan="4">Updated: {{ $status->created_at }}</td>
    </tr>
</table>