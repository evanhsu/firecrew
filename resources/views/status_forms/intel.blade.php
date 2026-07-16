<form
    action="{{ route('store_status_for_crew', ['crewId' => $crew->id]) }}"
    method="POST"
    class="form-horizontal intel-status-form"
    style="padding:25px"
>
    {{ csrf_field() }}

    <h2>Operations Contact</h2>

    <div class="form-group">
        <div class="intel-field-label">
            <label for="duty_officer_name" class="control-label">Name</label>
            <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="Operations Contact Name" data-trigger="focus" data-content="The name of the individual currently acting as Operations for this crew, i.e. the person who should be contacted about staffing.">
                <span class="glyphicon glyphicon-question-sign"></span>
            </a>
        </div>
        <div class="intel-field-input">
            <input type="text" name="duty_officer_name" id="duty_officer_name" class="form-control"
                   value="{{ $status->duty_officer_name }}">
        </div>
    </div>

    <div class="form-group">
        <div class="intel-field-label">
            <label for="duty_officer_phone" class="control-label">Phone</label>
            <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="Operations Contact Phone Number" data-trigger="focus" data-content="A reliable phone number for contacting Operations.">
                <span class="glyphicon glyphicon-question-sign"></span>
            </a>
        </div>
        <div class="intel-field-input">
            <input type="text" name="duty_officer_phone" id="duty_officer_phone" class="form-control"
                   value="{{ $status->duty_officer_phone }}" placeholder="XXX-XXX-XXXX">
        </div>
    </div>

    <!-- <h2>Crew Intel</h2>
    <div class="form-group">
        <label for="intel" class="control-label sr-only">Crew Intel</label>
        <div class="col-xs-12">
            <textarea name="intel" id="intel" class="form-control"
                      rows="4">{{ $status->intel }}</textarea>
        </div>
    </div> -->

    <!-- <h2>Personnel Assignments</h2>
    @for ($i = 1; $i <= 6; $i++)
        @include('status_forms/_fields_for_personnel_assignment')
    @endfor -->

    <div class="form-group">
        <div class="intel-field-label" aria-hidden="true"></div>
        <div class="intel-field-input">
            <button type="submit" class="btn btn-default">Update</button>
        </div>
    </div>

</form>
