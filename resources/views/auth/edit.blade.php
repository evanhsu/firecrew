@extends('../layouts.app')

@section('title','Edit Account - FireCrew')

@section('content')
<div class="container-fluid background-container">
    <div class="container form-box">
        <h1>Edit Account</h1>

		<form class="form-horizontal" role="form" method="POST" action="{{ $postRoute }}">
		    {{ csrf_field() }}

             <div class="form-group{{ $errors->has('name') ? ' has-error' : '' }}">
                <label for="name" class="col-sm-3 control-label">Name</label>

                <div class="col-sm-6">
                    <input id="name" type="text" class="form-control" name="name" value="{{ old('name') ? old('name') : $user->name }}" required autofocus>

                    @if ($errors->has('name'))
                        <span class="help-block">
                            <strong>{{ $errors->first('name') }}</strong>
                        </span>
                    @endif
                </div>
            </div>

            <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                <label for="email" class="col-sm-3 control-label">E-Mail</label>

                <div class="col-sm-6">
                    <input id="email" type="email" class="form-control" name="email" value="{{ old('email') ? old('email') : $user->email }}" required>

                    @if ($errors->has('email'))
                        <span class="help-block">
                            <strong>{{ $errors->first('email') }}</strong>
                        </span>
                    @endif
                </div>
            </div>

            <div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">
                <label for="password" class="col-sm-3 control-label">Change Password</label>

                <div class="col-sm-6">
                    <input id="password" type="password" class="form-control" name="password">

                    @if ($errors->has('password'))
                        <span class="help-block">
                            <strong>{{ $errors->first('password') }}</strong>
                        </span>
                    @endif
                </div>
            </div>


		    <div class="form-group">
		        <div class="col-sm-6 col-sm-offset-3">
		            <button type="submit" class="btn btn-primary">
		                Save
		            </button>
		        </div>
		    </div>
		</form>
	</div>
</div>
@endsection
