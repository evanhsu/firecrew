<?php

namespace App\Providers;

use App\Events\CrewStatusUpdated;
use App\Events\ResourceStatusUpdated;
use App\Listeners\SendWebhook;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        CrewStatusUpdated::class => [],
        ResourceStatusUpdated::class => [
            SendWebhook::class,
        ],
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];
}
