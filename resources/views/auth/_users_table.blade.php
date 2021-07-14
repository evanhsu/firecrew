<table class="table">
	<thead>
		<tr><th>ID</th>
			<th>Name</th>
			<th>Email</th>
			<th>Crew</th>
			<th>Delete</th>
		</tr>
	</thead>
	<tbody>
	@foreach($users as $user)
		<tr>
			<td>{{ $user->id }}</td>
			<td>{{ $user->name }}</td>
			<td>{{ $user->email }}</td>
			<td>{{ empty($user->crew_id) ? "Admin" : substr($user->crew->name,0,35) }}</td>
			<td><form action="{{ route('destroy_user',$user->id) }}" method="POST" class="form-inline">
					{{ csrf_field() }}
					<button type="submit" class="btn btn-sm btn-danger">X</button>
				</form></td>
		</tr>

	@endforeach
	</tbody>
</table>