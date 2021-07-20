<form action="{{ route('store_status_for_crew_resource', ['crewId' => $crew->id, 'identifier' => $resource->identifier]) }}"
      method="POST"
      class="form-horizontal"
>
    {{ csrf_field() }}
    <input type="hidden" name="statusable_resource_type" value="{{ $resource->resource_type }}" />
    <input type="hidden" name="statusable_resource_id" value="{{ $resource->id }}" />
    <input type="hidden" name="statusable_resource_name" value="{{ $resource->identifier}}" />


    <div class="col-xs-12">
        @include("status_forms._fields_for_location")
    </div>

    <div class="col-xs-12 col-md-6">
        <h2>Staffing</h2>
        @if(!is_null($resource->staffingCategory1()))
        <div class="form-group">
            <label for="staffing_value1" class="col-md-3 control-label control-label-with-helper">
                {{ $resource->staffingCategory1() }}
            </label>
            <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="{{ $resource->staffingCategory1() }}" data-trigger="focus" data-content="{{ $resource->staffingCategory1Explanation() }}">
                <span class="glyphicon glyphicon-question-sign"></span>
            </a>
            <div class="col-md-2">
                <input type="text" name="staffing_category1" id="staffing_category1" class="hidden" value="{{ $resource->staffingCategory1() }}">
                <input type="text" name="staffing_value1" id="staffing_value1" class="form-control"  value="{{ $status->staffing_value1 }}">
            </div>
        </div>
        @endif
        @if(!is_null($resource->staffingCategory2()))
        <div class="form-group">
            <label for="staffing_value2" class="col-md-3 control-label control-label-with-helper">
                {{ $resource->staffingCategory2() }}
            </label>
            <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="{{ $resource->staffingCategory2() }}" data-trigger="focus" data-content="{{ $resource->staffingCategory2Explanation() }}">
                <span class="glyphicon glyphicon-question-sign"></span>
            </a>
            <div class="col-md-2">
                <input type="text" name="staffing_category2" id="staffing_category2" class="hidden" value="{{ $resource->staffingCategory2() }}">
                <input type="text" name="staffing_value2" id="staffing_value2" class="form-control" value="{{ $status->staffing_value2 }}">
            </div>
        </div>
        @endif
        @if(!is_null($resource->staffingCategory3()))
            <div class="form-group">
                <label for="staffing_value3" class="col-md-3 control-label control-label-with-helper">
                    {{ $resource->staffingCategory3() }}
                </label>
                <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="{{ $resource->staffingCategory3() }}" data-trigger="focus" data-content="{{ $resource->staffingCategory3Explanation() }}">
                    <span class="glyphicon glyphicon-question-sign"></span>
                </a>
                <div class="col-md-3">
                    <input type="text" name="staffing_category3" id="staffing_category3" class="hidden" value="{{ $resource->staffingCategory3() }}">
                    <input type="text" name="staffing_value3" id="staffing_value3" class="form-control" value="{{ $status->staffing_value3 }}">
                </div>
            </div>
        @endif
        <div class="form-group">
            <label for="manager_name" class="col-md-3 control-label control-label-with-helper">Manager</label>
            <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="Manager" data-trigger="focus" data-content="Enter the name of the person who is currently managing the aircraft, i.e. the person who should be contacted about staffing or mission requests.">
                <span class="glyphicon glyphicon-question-sign"></span>
            </a>
            <div class="col-md-6">
                <input type="text" name="manager_name" id="manager_name" class="form-control" value="{{ $status->manager_name }}">
            </div>
        </div>
        <div class="form-group">
            <label for="manager_phone" class="col-md-3 control-label control-label-with-helper">Phone</label>
            <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="Manager Phone" data-trigger="focus" data-content="A phone number where the manager can be reached.">
                <span class="glyphicon glyphicon-question-sign"></span>
            </a>
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
            <label for="comments1" class="col-xs-4 col-sm-2 control-label control-label-with-helper">Situation</label>
            <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="Situation" data-trigger="focus" data-content="The current status of this aircraft and assigned personnel.  This would be an appropriate place to report the activity level of the aircraft, boosters being hosted, training opportunities, or the aircraft being unavailable.">
                <span class="glyphicon glyphicon-question-sign"></span>
            </a>
            <div class="col-xs-12 col-sm-6 col-md-6">
                <textarea name="comments1" id="comments1" class="form-control" rows="4">{{ $status->comments1 }}</textarea>
            </div>
        </div>
        <div class="form-group">
            <label for="comments2" class="col-xs-4 col-sm-2 control-label control-label-with-helper">Upcoming</label>
            <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="Upcoming" data-trigger="focus" data-content="This is the place to mention things like: upcoming days off, scheduled maintenance, scheduled proficiency flights, etc.">
                <span class="glyphicon glyphicon-question-sign"></span>
            </a>
            <div class="col-xs-12 col-sm-6 col-md-6">
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
