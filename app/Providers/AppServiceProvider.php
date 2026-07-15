<?php

namespace App\Providers;

use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
use Bugsnag\Report;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if (config('app.force_https')) {
            URL::forceScheme('https');
        }

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->app->booted(function () {
            if (! config('bugsnag.api_key')) {
                return;
            }

            // Drop 404/405 even when thrown as generic HttpException (e.g. abort(405)).
            Bugsnag::registerCallback(function (Report $report) {
                $exception = $report->getOriginalError();

                if ($exception instanceof HttpExceptionInterface
                    && in_array($exception->getStatusCode(), [404, 405], true)
                ) {
                    return false;
                }
            });
        });
    }
}
