<?php

use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return [

    /*
    |--------------------------------------------------------------------------
    | API Key
    |--------------------------------------------------------------------------
    |
    | You can find your API key on your Bugsnag dashboard.
    |
    */

    'api_key' => env('BUGSNAG_API_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Discard Classes
    |--------------------------------------------------------------------------
    |
    | Exception classes that should never be sent to Bugsnag. Helps ignore
    | noisy bot probes for missing paths and wrong HTTP methods.
    |
    */

    'discard_classes' => [
        MethodNotAllowedHttpException::class,
        NotFoundHttpException::class,
    ],

];
