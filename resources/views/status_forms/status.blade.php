@extends('../layouts.status_update_layout')



@section('form')
    <h1>Status Update</h1>

    <div>
        <ul class="nav nav-tabs" role="tablist">
            <li role="presentation"{!! ($tailnumber == "") ? " class=\"active\"" : "" !!}>
                <a href="#intel" aria-controls="intel" role="tab" data-toggle="tab">Intel</a></li>
            </li>
            @foreach($resources as $resource)
                @php
                    $sanitizedIdentifier = str_replace('=', '', base64_encode($resource->identifier));
                @endphp

                <li role="presentation"{!! ($resource->identifier == $tailnumber) ? " class=\"active\"" : "" !!}>
                    <a href="#{{ $sanitizedIdentifier }}" aria-controls="{{ $resource->identifier }}" role="tab" data-toggle="tab">
                        {{ $resource->identifier }}
                    </a>
                </li>
            @endforeach
        </ul>
    </div>


    <div class="tab-content">
        <div role="tabpanel" class="tab-pane{!! ($tailnumber == "") ? " in active" : "" !!}" id="intel">
            @include('status_forms/intel', ['status' => $crew->status])
        </div>

        @foreach($resources as $resource)
            @php
                $sanitizedIdentifier = str_replace('=', '', base64_encode($resource->identifier));
            @endphp

        <div role="tabpanel" class="tab-pane{!! ($tailnumber == $resource->identifier) ? " in active" : "" !!}" id="{{ $sanitizedIdentifier }}">
            @include('freshness_alerts/'.$resource->resource_type, ['freshness' => $resource->freshness()])
            @include('status_forms/'.$resource->resource_type, ['status' => $resource->latestStatus])
        </div>

        @endforeach

    </div>
@endsection

@section('scripts-postload')
@parent
<script>
    $(function () {
      $('[data-toggle="popover"]').popover()
    })
</script>
@endsection