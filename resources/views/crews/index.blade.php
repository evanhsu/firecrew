@extends('../layouts.app')

@section('title','Crews - RescueCircle')


@section('content')
<div id="container-fluid" class="container-fluid background-container">
	<div class="container form-box">
	    <h1>Listing All Crews</h1>

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
				<tr><th>ID</th>
					<th>Crew Name</th>
					<th>Update</th>
					<th>Delete</th>
				</tr>
			</thead>
			<tbody>
			@foreach($crews as $crew)
				<tr>
					<td>{{ $crew->id }}</td>
					<td><a href="{{ route('edit_crew', array('crewId' => $crew->id)) }}">{{ $crew->name }}</a></td>
					<td>
                        <a href="{{ route('new_status_for_crew',$crew->id) }}" class="btn btn-primary" role="button">!</a>
					</td>

					<td><form action="{{ route('destroy_crew',$crew->id) }}" method="POST" class="form-inline">
							{{ csrf_field() }}
							<button type="submit" class="btn btn-sm btn-danger">X</button>
						</form></td>
				</tr>

			@endforeach
			</tbody>
		</table>
		<a role="button" class="btn btn-default" href="{{ route('new_crew') }}">Create New Crew</a>
	</div>
</div>
@endsection
