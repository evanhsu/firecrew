<form action="{{ route('store_status_for_crew_resource', ['crewId' => $crew->id, 'identifier' => $status->statusable_resource_name]) }}"
      method="POST"
      class="form-horizontal"
>
    {{ csrf_field() }}
    <input type="hidden" name="statusable_resource_type" value="{{ $status->resource->resource_type }}" />
    <input type="hidden" name="statusable_resource_id" value="{{ $status->resource->id }}" />
    <input type="hidden" name="statusable_resource_name" value="{{ $status->resource->identifier}}" />


    <div class="col-xs-12">
        @include("status_forms._fields_for_location")
    </div>

    <div class="col-xs-12 col-md-6">
        <h2>Staffing</h2>
        <div class="form-group">
            <label for="staffing_value1" class="col-md-3 control-label">Rounds</label>
            <div class="col-md-2">
                <input type="text" name="staffing_value1" id="staffing_value1" class="form-control" value="{{ $status->staffing_value1 }}">
            </div>
        </div>
        <div class="form-group">
            <label for="staffing_value2" class="col-md-3 control-label">Squares</label>
            <div class="col-md-2">
                <input type="text" name="staffing_value2" id="staffing_value2" class="form-control" value="{{ $status->staffing_value2 }}">
            </div>
        </div>
        <div class="form-group">
            <label for="manager_name" class="col-md-3 control-label">Spotter</label>
            <div class="col-md-6">
                <input type="text" name="manager_name" id="manager_name" class="form-control" value="{{ $status->manager_name }}">
            </div>
        </div>
        <div class="form-group">
            <label for="manager_phone" class="col-md-3 control-label">Phone</label>
            <div class="col-md-6">
                <input type="text" name="manager_phone" id="manager_phone" class="form-control" value="{{ $status->manager_phone }}" placeholder="XXX-XXX-XXXX">
            </div>
        </div>
    </div>

    <div class="col-xs-12 col-md-6">
        <h2>Current Assignment</h2>
        <div class="form-group">
            <label for="assigned_fire_name" class="col-xs-4 col-sm-2 control-label">Fire Name</label>
            <div class="col-sm-6">
                <input type="text" name="assigned_fire_name" id="assigned_fire_name" class="form-control" value="{{ $status->assigned_fire_name }}" placeholder="i.e. The Example Fire">
            </div>
        </div>
        <div class="form-group">
            <label for="assigned_fire_number" class="col-xs-4 col-sm-2 control-label">Fire Number</label>
            <div class="col-sm-6">
                <input type="text" name="assigned_fire_number" id="assigned_fire_number" class="form-control" value="{{ $status->assigned_fire_number }}" placeholder="AA-BBB-123456">
            </div>
        </div>
        <div class="form-group">
            <label for="assigned_supervisor" class="col-xs-4 col-sm-2 control-label">Reporting To:</label>
            <div class="col-sm-6">
                <input type="text" name="assigned_supervisor" id="assigned_supervisor" class="form-control" value="{{ $status->assigned_supervisor }}">
            </div>
        </div>
        <div class="form-group">
            <label for="assigned_supervisor_phone" class="col-xs-4 col-sm-2 control-label">Phone</label>
            <div class="col-sm-6">
                <input type="text" name="assigned_supervisor_phone" id="assigned_supervisor_phone" class="form-control" value="{{ $status->assigned_supervisor_phone }}" placeholder="XXX-XXX-XXXX">
            </div>
        </div>
    </div>

    <div class="col-xs-12">
        <h2>Remarks</h2>
        <div class="form-group">
            <label for="comments1" class="col-xs-4 col-sm-2 control-label">Situation</label>
            <div class="col-xs-12 col-sm-6 col-md-5">
                <textarea name="comments1" id="comments1" class="form-control" rows="4">{{ $status->comments1 }}</textarea>
            </div>
        </div>
        <div class="form-group">
            <label for="comments2" class="col-xs-4 col-sm-2 control-label">Upcoming</label>
            <div class="col-xs-12 col-sm-6 col-md-5">
                <textarea name="comments2" id="comments2" class="form-control" rows="4">{{ $status->comments2 }}</textarea>
            </div>
        </div>
    </div>

    <div class="col-xs-12">
        <div class="form-group">
            <div class="col-sm-3">
                <button type="submit" class="btn btn-default">Update</button>
            </div>
        </div>
    </div>

</form>
