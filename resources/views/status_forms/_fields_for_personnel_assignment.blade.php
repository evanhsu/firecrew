<?php
    $name_attr      = "personnel_".$i."_name";
    $role_attr      = "personnel_".$i."_role";
    $location_attr  = "personnel_".$i."_location";
    $note_attr      = "personnel_".$i."_note";

?>

<div class="col-xs-1" style="display: flex; align-items: center; justify-content: center; height: 3em; font-size: 2em">{{ $i }})</div>
<div class="col-xs-11">
    <div class="col-xs-12 col-sm-6">
        <div class="col-xs-8">
            <div class="form-group">
                <input type="text" name="{{ $name_attr }}" id="{{ $name_attr }}"
                       class="form-control" placeholder="Name"
                       value="{{ $status->$name_attr }}">
            </div>
        </div>

        <div class="col-xs-4">
            <div class="form-group">
                <input type="text" name="{{ $role_attr }}" id="{{ $role_attr }}"
                       class="form-control" placeholder="ICS Role"
                       value="{{ $status->$role_attr }}">
            </div>
        </div>
        <div class="col-xs-12">
            <div class="form-group">
                <input type="text" name="{{ $location_attr }}" id="{{ $location_attr }}"
                       class="form-control" placeholder="Location"
                       value="{{ $status->$location_attr }}">
            </div>
        </div>
    </div>
    <div class="col-xs-12 col-sm-6">
        <div class="form-group">
                <textarea name="{{ $note_attr }}"
                          id="{{ $note_attr }}"
                          class="form-control"
                          placeholder="Notes"
                          style="height:6em">{{ $status->$note_attr }}</textarea>
        </div>
    </div>
</div>