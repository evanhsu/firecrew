@extends('layouts.app')

<?php
use App\Domain\StatusableResources\AbstractStatusableResource;

/**
 * @param int $index The array index to use when submitting this form
 * @param Aircraft|array $aircraft An Aircraft model to populate this form with - ['tailnumber'=>'N12345', 'model'=>'Bell 205']
 * @param $crew
 * @param bool $template If TRUE, this function will draw the blank template for an Aircraft Form rather than a populated form.
 */
function drawOneAircraftForm($index, $aircraft, $crew, $aircraft_models, $template = false) {

    if($template) {
        $aircraft = new App\Domain\StatusableResources\AbstractStatusableResource(array("identifier"=>"","model"=>""));
        $index = "";
    }
    $output = "<div class=\"crew-aircraft-form";
    if($template) $output .= " dynamic-form-template";
    $output .= "\">
        <div class=\"form-group\">
            <label for=\"aircraft-identifier\" class=\"control-label  control-label-with-helper col-sm-2\">Tailnumber</label>
            <a role=\"button\" class=\"control-label-helper\" tabindex=\"0\" data-toggle=\"popover\" title=\"Tailnumber\" data-trigger=\"focus\" data-content=\"Enter the full tailnumber for this aircraft (beginning with the 'N' for US registrations)\">
                <span class=\"glyphicon glyphicon-question-sign\"></span>
            </a>
            <div class=\"col-sm-4 col-md-3\">
                <input type=\"text\" class=\"form-control aircraft-identifier\" name=\"crew[statusableResources][".$index."][identifier]\" value=\"".$aircraft->identifier."\" ";

    if(!$template) $output .= "readonly ";

    $output .= "/>\n";

    if($template) {
        $output .= "<div class=\"identifier-validation-message has-error hidden\" id=\"identifier-validation-message-$index\"></div>";
    }

    $output .= "</div>\n";

    if(!$template) {
        $output .= "<button class=\"btn btn-default release-aircraft-button\" data-aircraft-id=\"".$index."\" type=\"button\" title=\"Remove this aircraft from your crew. None of the aircraft data will be deleted, and the aircraft can be added to your crew again later by simply clicking the 'Add an Aircraft' button and entering this tailnumber.\">Release</button>\n";
    }

     $output .= "
        </div>

        <div class=\"form-group\">
            <label for=\"aircraft-model\" class=\"control-label col-sm-2\">Make/Model</label>
            <span class=\"control-label-helper control-label-helper-spacer\" aria-hidden=\"true\">
                <span class=\"glyphicon glyphicon-question-sign\"></span>
            </span>
            <div class=\"col-sm-4 col-md-3\">
                <select class=\"form-control aircraft-model\" name=\"crew[statusableResources][".$index."][model]\">\n";
    
    foreach($aircraft_models as $modelKey => $modelText) {
        $output .= "<option value=\"".$modelKey."\"";
        
        if ($aircraft->model === $modelKey) {
            $output .= " selected=\"selected\"";
        }

        $output .= ">".$modelText."</option>\n";
    }

    $output .= "</select>
            </div>
        </div>

        <div class=\"form-group\">
            <label for=\"aircraft-type\" class=\"control-label col-sm-2\">Usage</label>
            <a role=\"button\" class=\"control-label-helper\" tabindex=\"0\" data-toggle=\"popover\" title=\"What type of missions is this aircraft used for?\" data-trigger=\"focus\" data-content=\"Only Rappel aircraft are currently supported\">
                <span class=\"glyphicon glyphicon-question-sign\"></span>
            </a>
            <div class=\"col-sm-4 col-md-3\">
                <input type=\"text\"  class=\"form-control aircraft-type\" name=\"crew[statusableResources][".$index."][resource_type]\" value=\"Rappel\" disabled=true />
                <input type=\"hidden\" class=\"form-control aircraft-type\" name=\"crew[statusableResources][".$index."][resource_type]\" value=\"RappelHelicopter\" readonly=true />
            </div>
        </div>\n";

    if(!$template) {
        $output .= "<div class=\"form-group\">
                        <div class=\"col-sm-offset-2\">
                            <a href=\"".route('new_status_for_crew',['crewId' => $crew->id, 'tailnumber' => $aircraft->identifier])."\" class=\"btn btn-default\" role=\"button\">Go to the Status Page</a>
                        </div>
                    </div>\n";

        $output .= freshnessNotify($aircraft->freshness());
    }
    else {
        $output .= "<div class=\"alert alert-warning\"><strong>Remember:</strong> this new aircraft won't show up on the map until you submit a Status Update!</div>";
    }

    $output .= "</div>\n";

    echo $output;
}

function freshnessNotify($freshness) {
    // Return a string that will draw a Bootstrap alert for an aging aircraft (no recent updates)
    $hours_til_stale = config('app.hours_until_updates_go_stale');
    $days_til_expired = config('app.days_until_updates_expire');

    switch($freshness) {
        case "fresh":
            $output = "";
            break;
        case "stale":
            $output = "<div class=\"alert alert-warning\"><strong>Stale Info!</strong><br />This aircraft is grayed out on the map because it hasn't been updated in over ".$hours_til_stale." hours.</div>";
            break;
        case "expired":
            $output = "<div class=\"alert alert-danger\"><strong>Expired Info!</strong><br />This aircraft has been removed from the map because it hasn't been updated in over ".$days_til_expired." days.  Just submit a new Status Update to get it back!</div>";
            break;
        case "missing":
        default:
            $output = "<div class=\"alert alert-danger\"><strong>No updates have been submitted!</strong><br />This aircraft does not appear on the map because no updates have been submitted yet.</div>";
            break;
    }
    return $output;
}
?>




@section('title','Crew Info')


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
        <h2>Crew Identity</h2>
        <form action="{{ route('update_crew',$crew->id) }}" id="edit_crew_form" name="edit_crew_form" method="POST" class="form-horizontal" enctype="multipart/form-data">
            {{ csrf_field() }}
            <input type="hidden" name="crew_id" value="{{ $crew->id }}" />
            <div class="form-group">
                <label for="name" class="col-xs-12 col-sm-2 control-label">Crew Name</label>

                <div class="col-xs-12 col-sm-10">
                    <input type="text" id="name" name="crew[name]" value="{{ $crew->name }}" class="form-control" />
                </div>
            </div>

        
            <h3>Home Base</h3>

            <div class="form-group">
                <label for="street1" class="col-xs-12 col-sm-2 control-label">Street 1</label>

                <div class="col-xs-12 col-sm-10">
                    <input type="text" id="street1" name="crew[address_street1]" value="{{ $crew->address_street1 }}" class="form-control" />
                </div>
            </div>

            <div class="form-group">
                <label for="street2" class="col-xs-12 col-sm-2 control-label">Street 2</label>

                <div class="col-xs-12 col-sm-10">
                    <input type="text" id="street2" name="crew[address_street2]" value="{{ $crew->address_street2 }}" class="form-control" />
                </div>
            </div>

            <div class="form-group">
                <label for="city" class="col-xs-12 col-sm-2 control-label">City</label>

                <div class="col-xs-12 col-sm-10">
                    <input type="text" id="city" name="crew[address_city]" value="{{ $crew->address_city }}" class="form-control" />
                </div>
            </div>

            <div class="form-group">
                <label for="state" class="col-xs-12 col-sm-2 control-label">State</label>

                <div class="col-xs-12 col-sm-10">
                    <input type="text" id="state" name="crew[address_state]" value="{{ $crew->address_state }}" class="form-control" />
                </div>
            </div>

            <div class="form-group">
                <label for="zip" class="col-xs-12 col-sm-2 control-label">Zip</label>

                <div class="col-xs-12 col-sm-10">
                    <input type="number" id="zip" name="crew[address_zip]" value="{{ $crew->address_zip }}" class="form-control" />
                </div>
            </div>

            <div class="form-group">
                <label for="phone" class="col-xs-12 col-sm-2 control-label">Phone</label>

                <div class="col-xs-12 col-sm-10">
                    <input type="tel" id="phone" name="crew[phone]" value="{{ $crew->phone }}" class="form-control" />
                </div>
            </div>

            <div class="form-group">
                <label for="fax" class="col-xs-12 col-sm-2 control-label">Fax</label>

                <div class="col-xs-12 col-sm-10">
                    <input type="tel" id="fax" name="crew[fax]" value="{{ $crew->fax }}" class="form-control" />
                </div>
            </div>

            <div class="form-group">
                <label for="logo" class="col-xs-12 col-sm-2 control-label">Logo</label>

                <div class="col-xs-8 col-sm-6 col-md-4">
                    <img src="{{ $crew->logo_filename }}?={{ $crew->updated_at }}" style="width:100px; height:100px;" />
                    <input type="file" id="logo" name="logo" class="form-control" />
                </div>
            </div>

            <h3>Integrations</h3>

            <div class="form-group">
                <label for="webhook_url" class="col-xs-12 col-sm-2 control-label">Webhook URL</label>

                <div class="col-xs-12 col-sm-10">
                    <input type="text" id="webhook_url" name="crew[webhook_url]" value="{{ $crew->webhook_url }}" class="form-control" />
                </div>
            </div>
            
            <!-- <h3>Home Dispatch Center</h3>

            <div class="form-group">
                <label for="dispatch_center_name" class="col-xs-12 col-sm-2 control-label">Name</label>

                <div class="col-xs-12 col-sm-6">
                    <input id="dispatch_center_name" name="crew[dispatch_center_name]" value="{{ $crew->dispatch_center_name}}" class="form-control" />
                </div>
            </div>

            <div class="form-group">
                <label for="dispatch_center_identifier" class="col-xs-12 col-sm-2 control-label">Identifier</label>

                <div class="col-xs-12 col-sm-6">
                    <input id="dispatch_center_identifier" name="crew[dispatch_center_identifier]" value="{{ $crew->dispatch_center_identifier}}" class="form-control" />
                </div>
            </div>

            <div class="form-group">
                <label for="dispatch_center_daytime_phone" class="col-xs-12 col-sm-2 control-label">Daytime Phone</label>

                <div class="col-xs-12 col-sm-6">
                    <input type="tel" id="dispatch_center_daytime_phone" name="crew[dispatch_center_daytime_phone]" value="{{ $crew->dispatch_center_daytime_phone}}" class="form-control" />
                </div>
            </div>

            <div class="form-group">
                <label for="dispatch_center_24_hour_phone" class="col-xs-12 col-sm-2 control-label">24-Hour Phone</label>

                <div class="col-xs-12 col-sm-6">
                    <input type="tel" id="dispatch_center_24_hour_phone" name="crew[dispatch_center_24_hour_phone]" value="{{ $crew->dispatch_center_24_hour_phone}}" class="form-control" />
                </div>
            </div> -->

@if($show_aircraft)
            
            <h3>Aircraft</h3>
            <div class="form-group">
                <div class="col-sm-2">
                    <label for="add-aircraft-button" class="control-label sr-only">Add an Aircraft</label>
                    <button class="btn btn-default" id="add-aircraft-button" type="button" title="Assign another aircraft to this crew">Add an Aircraft</button>
                </div>
            </div>
            <?php $i = 0; ?>
            @foreach($crew->statusableResources as $aircraft)
                <?php drawOneAircraftForm($i, $aircraft, $crew, $aircraft_models); ?>
                <?php $i++; ?>
            @endforeach


            <div id="dynamic-form-insert-placeholder" style="display:none;"></div>
@endif
            <div class="form-group">
                <div class="col-sm-2">
                    <button type="submit" class="btn btn-default">Save</button>
                </div>
            </div>
        </form>


@if($show_aircraft)
        <?php drawOneAircraftForm(null, null, $crew, $aircraft_models, true); ?>

        <div id="aircraft-index" style="display:none;">{{ $i }}</div>
@endif

    </div>

</div>
@endsection
