<?php
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
    $alert['msg'] .= "<br />Last update posted by ".$resource->latestStatus->created_by_name." ".$resource->latestStatus->created_at->diffForHumans(); // Function provided by the Carbon date/time library
}
?>

<div class="freshness_notification alert alert-{!! $alert['type'] !!}" role="alert">
    {!! $alert['msg'] !!}
</div>
