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
