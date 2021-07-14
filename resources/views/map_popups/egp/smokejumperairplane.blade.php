<?php
// views/map_popups/egp/smokejumperairplane.blade.php
//
// This file contains the HTML that will be displayed in a popup box when a Smokejumper Airplane
// feature is clicked on the EGP map.
//
// $status is a Status object that must be passed to this view by the controller.
?>
<table>
    <tr>
        <td style="vertical-align:top;">
            <div style="text-align:left;vertical-align:top;padding:0 1em 0 0;font-weight:bold;font-size: 1.3em;border-bottom: 2px solid #888888;">Spotter</div>
            {{ $status->manager_name }}<br />
            {{ $status->manager_phone }}
        </td>

        <td style="vertical-align:top;">
            <div style="text-align:left;vertical-align:top;padding:0 1em 0 0;font-weight:bold;font-size: 1.3em;border-bottom: 2px solid #888888;">Staffing</div>
            <table style="margin:0;padding:0;border:none;">
                <tr><td>SMKJ:</td><td>{{ $status->staffing_value1 }}</td></tr>
            </table>
        </td>

        <td style="vertical-align:top;">
            <div style="text-align:left;vertical-align:top;padding:0 1em 0 0;font-weight:bold;font-size: 1.3em;border-bottom: 2px solid #888888;">Assigned</div>
            {{ $status->assigned_fire_name }}<br />
            {{ $status->assigned_fire_number }}<br />
            {{ $status->assigned_supervisor }}<br />
            {{ $status->assigned_supervisor_phone }}</td>
    </tr>
    <tr>
        <td style="width:100%; text-align:right;" colspan="3">Updated: {{ date('m-d-Y H:m', strtotime($status->created_at)) }}</td>
    </tr>
</table>