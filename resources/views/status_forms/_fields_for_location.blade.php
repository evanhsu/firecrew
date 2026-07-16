<h2>Location <small>(Required)</small></h2>

<div class="form-group clearfix" style="padding-left: 15px; gap:10px">
    <label for="location_name" class="control-label control-label-with-helper">Location Name</label>
    <a role="button" class="" tabindex="0" data-toggle="popover" title="Location Name" data-trigger="focus" data-content="The name of the city, town, or landmark nearest to your location.">
        <span class="glyphicon glyphicon-question-sign"></span>
    </a>
    <div style="max-width: 244px;">
        <input
            type="text"
            name="location_name"
            id="location_name"
            class="form-control"
            value="{{ $status->location_name }}"
            placeholder="Toketee, OR"
            aria-label="Location name"
        >
    </div>
</div>

<div class="form-group latlon-form-group clearfix" style="padding-left: 15px">
    <label class="control-label">Lat/Lon</label>
    <div class="latlon-fields">
        <div class="latlon-rows">
            <div class="latlon-row">
                <span class="latlon-hemisphere" aria-hidden="true">N</span>
                <label for="latitude_deg" class="sr-only">Degrees of Latitude</label>
                <input
                    type="text"
                    name="latitude_deg"
                    id="latitude_deg"
                    class="form-control latlon-degrees"
                    value="{{ $status->latitude_deg }}"
                    placeholder="41"
                    aria-label="Latitude (whole degrees)"
                >
                <span class="latlon-unit" aria-hidden="true">&deg;</span>
                <label for="latitude_min" class="sr-only">Minutes of Latitude</label>
                <input
                    type="text"
                    name="latitude_min"
                    id="latitude_min"
                    class="form-control latlon-minutes"
                    value="{{ $status->latitude_min }}"
                    placeholder="12.3456"
                    aria-label="Latitude (decimal minutes)"
                >
                <span class="latlon-unit-label">minutes</span>
            </div>
            <div class="latlon-row">
                <span class="latlon-hemisphere" aria-hidden="true">W</span>
                <label for="longitude_deg" class="sr-only">Degrees of Longitude</label>
                <input
                    type="text"
                    name="longitude_deg"
                    id="longitude_deg"
                    class="form-control latlon-degrees"
                    value="{{ $status->longitude_deg }}"
                    placeholder="120"
                    aria-label="Longitude (whole degrees)"
                >
                <span class="latlon-unit" aria-hidden="true">&deg;</span>
                <label for="longitude_min" class="sr-only">Minutes of Longitude</label>
                <input
                    type="text"
                    name="longitude_min"
                    id="longitude_min"
                    class="form-control latlon-minutes"
                    value="{{ $status->longitude_min }}"
                    placeholder="12.3456"
                    aria-label="Longitude (decimal minutes)"
                >
                <span class="latlon-unit-label">minutes</span>
            </div>
        </div>
        <div class="latlon-geolocate">
            <a href="#" class="geolocate_button"><span class="glyphicon glyphicon-map-marker"></span> Use current location</a>
        </div>
    </div>
</div>
