{{ csrf_field() }}
<input type="hidden" name="statusable_type" value="{{ $crew->statusable_type }}" />
<input type="hidden" name="statusable_id" value="{{ $aircraft->id }}" />
<input type="hidden" name="statusable_name" value="{{ $aircraft->tailnumber }}" />

<?php
$freshness = $aircraft->freshness();

switch($freshness) {
    case "missing":
        $alert = array( 'msg'   => "No updates have ever been posted for this Aircraft!",
            'type'  => 'warning');
        break;
    case "fresh":
        $alert = array( 'msg'   => "This aircraft's status is still fresh",
            'type'  => 'success');
        break;
    case "stale":
        $alert = array( 'msg'   => "This aircraft's status is out of date",
            'type'  => 'warning');
        break;
    case "expired":
        $alert = array( 'msg'   => "This aircraft's status is expired!",
            'type'  => 'danger');
        break;
}
if($freshness != "missing") {
    $alert['msg'] .= "<br />Last update posted by ".$status->created_by_name." ".$status->created_at->diffForHumans(); // Function provided by the Carbon date/time library
}

echo "<div class=\"freshness_notification alert alert-".$alert['type']."\" role=\"alert\">\n"
    .$alert['msg']
    ."</div>\n";

?>
