<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AircraftController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Crew\CrewAccountController;
use App\Http\Controllers\Crew\CrewController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\PagesController;
use App\Http\Controllers\Status\CrewStatusController;
use App\Http\Controllers\Status\ResourceStatusController;
use App\Http\Controllers\Status\SummaryController;
use Illuminate\Support\Facades\Route;

Route::get('/', [SummaryController::class, 'index']);
Route::get('/summary', [SummaryController::class, 'index'])->name('summary');
Route::get('/map', [MapController::class, 'getMap'])->name('map');
Route::get('/home', [HomeController::class, 'index']);
Route::get('/privacy', [PagesController::class, 'privacy']);

Route::get('login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('login', [LoginController::class, 'login']);
Route::post('logout', [LoginController::class, 'logout'])->name('logout');
Route::get('register', [RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('register', [RegisterController::class, 'register']);
Route::get('password/reset', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('password/email', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('password/reset/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('password/reset', [ResetPasswordController::class, 'reset']);

Route::middleware('auth')->group(function () {
    Route::get('/aircraft', [AircraftController::class, 'index'])->name('aircraft_index');
    Route::get('/aircraft/{tailnumber}/status', [AircraftController::class, 'showCurrentStatus'])->name('current_status_for_aircraft');
    Route::get('/aircraft/{tailnumber}/update', [AircraftController::class, 'newStatus'])->name('new_status_for_aircraft');
    Route::post('/aircraft/{tailnumber}/release', [AircraftController::class, 'releaseFromCrew'])->name('release_aircraft');

    Route::prefix('crew')->group(function () {
        Route::get('/', [CrewController::class, 'index'])->name('crews_index');
        Route::post('/', [CrewController::class, 'store'])->name('store_crew');
        Route::get('/new', [CrewController::class, 'create'])->name('new_crew');

        Route::prefix('{crewId}')->group(function () {
            Route::get('/', [CrewController::class, 'show'])->name('crew');
            Route::post('/', [CrewController::class, 'update'])->name('update_crew');
            Route::get('/identity', [CrewController::class, 'edit'])->name('edit_crew');
            Route::get('/accounts', [CrewAccountController::class, 'index'])->name('users_for_crew');
            Route::post('/destroy', [CrewController::class, 'destroy'])->name('destroy_crew');

            Route::prefix('status')->group(function () {
                Route::get('/router', [CrewStatusController::class, 'redirectToStatusUpdate'])->name('status_form_selector_for_crew');
                Route::get('/{tailnumber?}', [CrewStatusController::class, 'newStatus'])->name('new_status_for_crew');
                Route::post('/', [CrewStatusController::class, 'store'])->name('store_status_for_crew');
            });

            Route::post('/resource/{identifier}/status', [ResourceStatusController::class, 'store'])->name('store_status_for_crew_resource');
        });
    });

    Route::get('/account', [AccountController::class, 'index'])->name('users_index');
    Route::post('/account', [RegisterController::class, 'postRegister'])->name('register_user');
    Route::get('/account/me', [AccountController::class, 'editMe'])->name('edit_user_me');
    Route::post('/account/me', [AccountController::class, 'updateMe'])->name('update_user_me');
    Route::get('/account/{id}', [AccountController::class, 'edit'])->name('edit_user');
    Route::post('/account/{id}', [AccountController::class, 'update'])->name('update_user');
    Route::post('/account/{id}/destroy', [AccountController::class, 'destroy'])->name('destroy_user');
    Route::get('crew/{crewId}/accounts/new', [AccountController::class, 'getRegister'])->name('new_user_for_crew');
    Route::post('crew/{crewId}/accounts', [AccountController::class, 'postRegisterUserForCrew'])->name('create_user_for_crew');
});
