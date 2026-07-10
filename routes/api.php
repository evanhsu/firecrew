<?php

use App\Http\Controllers\HealthzController;
use App\Http\Controllers\Status\ResourceStatusController;
use App\Http\Controllers\Status\SummaryController;
use Illuminate\Support\Facades\Route;

Route::get('/healthz', [HealthzController::class, 'get']);
Route::get('/summary', [SummaryController::class, 'indexApi']);
Route::get('/status/all', [ResourceStatusController::class, 'currentForAllResources']);
