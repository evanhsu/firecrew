@extends('../layouts.app')


@section('title','Aircraft - RescueCircle')


@section('content')
    <div id="container-fluid" class="container-fluid background-container">
        <div class="container form-box">
            <h1>Listing All Aircraft</h1>

            @if (count($errors) > 0)
                <div class="alert alert-danger">
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tailnumber</th>
                        <th>Make/Model</th>
                        <th>Crew</th>
                        <th style="width:30px;">Update</th>
                        <th style="width:30px;">Release</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($aircrafts as $a)
                        <tr>
                            <td>{{ $a->id }}</td>
                            <td>{{ $a->identifier}}</td>
                            <td>{{ $a->model }}</td>
                            <td id="crew-name-cell">
                                @if(!empty($a->crew_id))
                                    <a href="{{ route('edit_crew', array('id' => $a->crew_id)) }}">{{ $a->crew->name }}</a>
                                @endif
                            </td>
                            <td id="update-button-cell">
                                @if(!empty($a->crew_id))
                                    <a href="{{ route('new_status_for_crew',[$a->crew_id, $a->identifier]) }}"
                                       class="btn btn-primary" role="button">!</a>
                                @endif
                            </td>
                            <td id="release-button-cell">
                                @if(!empty($a->crew_id))
                                    <button class="btn btn-sm btn-danger release-aircraft-button"
                                            type="button"
                                            data-aircraft-id="{{ $a->id }}"
                                            data-aircraft-tailnumber="{{ $a->identifier }}"
                                            data-crew-id="{{ $a->crew_id }}"
                                            data-csrf-token="{{ csrf_token() }}"
                                    >X
                                    </button>
                                @endif
                            </td>
                        </tr>

                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
@endsection

@section('scripts-postload')
    @parent
    <script>
      // Add click behavior to the "Release" aircraft button
      $('.table').on('click', '.release-aircraft-button', function (event) {

        // Get the tailnumber of the aircraft to release
        var parent = $(this).parents('tr');
        var crew_id = $(this).data('crew-id');
        var csrf_token = $(this).data('csrf-token');
        var tailnumber = $(this).data('aircraft-tailnumber');
        var crewNameTableCell = $(this).parents('tr').children('#crew-name-cell');
        var updateButtonTableCell = $(this).parents('tr').children('#update-button-cell');

        console.group();
        console.log(tailnumber);
        console.log(crew_id);
        console.groupEnd();

        if (tailnumber === '') {
          // If no tailnumber has been specified, simply remove this entry from the page
          parent.hide(300, function () {
            this.remove();
          });
        } else {
          // Send AJAX request to release this aircraft from this crew
          $.ajax({
            url: '/aircraft/' + encodeURIComponent(tailnumber) + '/release',
            type: 'post',
            data: { '_token': csrf_token, 'sent-from-crew': crew_id },
          }).done(function () {
            // Success
            crewNameTableCell.text(''); // Remove the crew name
            updateButtonTableCell.text(''); // Remove the update button
          });
        }
      });
    </script>
@endsection