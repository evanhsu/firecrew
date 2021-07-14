@extends('../layouts.app')

@section('title','Accounts - RescueCircle')


@section('content')
<div class="container-fluid background-container">
    
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
		<h1>Accounts for {{ $crew->name }}</h1>
	    @include('auth._users_table')
	    <a role="button" class="btn btn-default" href="{{ route('new_user_for_crew',$crew->id) }}">Create New User Account</a>
	</div>

</div>
@endsection