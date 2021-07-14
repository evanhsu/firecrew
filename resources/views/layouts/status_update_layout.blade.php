@extends('../layouts.app')

@section('page-title','Status Update - FireCrew')
@section('page-description','Post a new status update for your Crew and its Resources.')


@section('content')
    <div id="container-fluid" class="container-fluid background-container">

        @if (count($errors) > 0)
            <div class="alert alert-danger">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div class="container form-box">
            @yield('form')
        </div>

    </div>

@endsection


@section('scripts-postload')
    @parent

    <script>
      $(document).ready(function () {
        // Add geolocation trigger to the 'geolocate_button'
        $('.geolocate_button').on('click', function (event) {
          handleGeoClick(event);
        });
      });

      function handleGeoClick(event) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            // Location successfully found
            populatePositionFields(event, position.coords.latitude, position.coords.longitude);
          }, function (error) {
            alert('Sorry!\nWe couldn\'t determine your location. ' +
              'This usually happens when Geolocation access is denied by your browser\'s security settings.\n\n' +
              'Search for \'browser location security settings\' for troubleshooting suggestions.');
            console.log('Geolocation error: ' + error.message);
          });
        } else {
          alert('Sorry, your browser doesn\'t support the geolocation feature.');
        }
      }

      function populatePositionFields(event, latitude, longitude) {
        // Coordinate input format is Decimal-degrees with "Easting" longitudes (locations in the western hemisphere have negative longitude).
        // i.e. latitude = 42.389043    longitude = -120.87849
        // Convert this into "westing" decimal-minutes and populate the form with the resulting values (western hemisphere has positive longitude).

        var lat_deg = Math.floor(Math.abs(latitude));   // Use absolute value so that floor() works as desired for negative numbers
        var lat_min = (Math.abs(latitude) - lat_deg) * 60.0;
        lat_deg = latitude >= 0 ? lat_deg : (lat_deg * 1.0); // Restore the original sign

        var lon_deg = Math.floor(Math.abs(longitude)); // Use absolute value so that floor() works as desired for negative numbers
        var lon_min = (Math.abs(longitude) - lon_deg) * 60.0;
        lon_deg = longitude < 0 ? lon_deg : (lon_deg * -1.0); // Switch from 'East' reference to 'West' reference (invert sign)

        var targetForm = $(event.target).closest('form');

        targetForm.find('input[name=latitude_deg]').val(lat_deg);
        targetForm.find('input[name=latitude_min]').val(lat_min.toPrecision(6));

        targetForm.find('input[name=longitude_deg]').val(lon_deg);
        targetForm.find('input[name=longitude_min]').val(lon_min.toPrecision(6));

      } // End populatePositionFields()

    </script>

@endsection