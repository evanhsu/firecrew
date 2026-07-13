@extends('../layouts.app')


@section('page-title','Aircraft - FireCrew')


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
                            <td>{{ $aircraft_models[$a->model] }}</td>
                            <td id="crew-name-cell">
                                @if(!empty($a->crew_id))
                                    <a href="{{ route('edit_crew', array('crewId' => $a->crew_id)) }}">{{ $a->crew->name }}</a>
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

