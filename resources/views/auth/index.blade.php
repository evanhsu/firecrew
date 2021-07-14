@extends('../layouts.app')

@section('title','Accounts')


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
	    @include('auth._users_table')

	    <div class="dropdown">

			<div class="list-group col-sm-12 col-md-6">
				<a href="#" class="list-group-item active" id="crewListCollapseButton" data-toggle="collapse" data-target="#crewMenu" aria-expanded="false" aria-controls="crewMenu">
					Create new account for...
					<span class="glyphicon glyphicon-menu-down" style="float:right;" aria-hidden="true"></span>
				</a>
				<div class="list-group collapse" id="crewMenu">
					@foreach($crews as $crew)
						<a class="list-group-item" href="{{ route('new_user_for_crew', $crew->id) }}">
							{{ $crew->name }}
						</a>
					@endforeach
				</div>
			</div>
		</div>

	</div>

</div>
@endsection