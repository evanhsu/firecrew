<?php

use App\Providers\AppServiceProvider;
use App\Providers\AuthServiceProvider;
use App\Providers\EventServiceProvider;
use App\Providers\ViewServiceProvider;
use Bugsnag\BugsnagLaravel\BugsnagServiceProvider;

return [
    // Bugsnag must be first so it can wrap Laravel's logging/exception pipeline.
    BugsnagServiceProvider::class,
    AppServiceProvider::class,
    AuthServiceProvider::class,
    EventServiceProvider::class,
    ViewServiceProvider::class,
];
