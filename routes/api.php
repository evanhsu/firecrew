<?php

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;
use Dingo\Api\Routing\Router;
$api = app('Dingo\Api\Routing\Router');

$api->version('v1', [], function (Router $api) {
	$api->group(['namespace' => '\\App\\Http\\Controllers'], function (Router $api) {
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

        $api->get('/status/all', '\App\Http\Controllers\Status\ResourceStatusController@currentForAllResources');
    //  $api->post('/status',       array('as' => 'create_status',      'uses' => 'StatusController@store' ));
        $api->get('/summary', 'Status\SummaryController@indexApi');


// TODO: Add this back in:
//	    $api->group(['middleware' => 'api.auth'], function (Router $api) {

            // Items
            $api->get('/crews/{crewId}/items', 'ItemsController@indexForCrew');
            $api->get('/crews/{crewId}/items/categories', 'ItemsController@categoriesForCrew');
            $api->post('/crews/{crewId}/items', 'ItemsController@create');
            $api->get('/items/{itemId}', 'ItemsController@show');
            $api->patch('/items/{itemId}', 'ItemsController@update');
            $api->post('/items/{itemId}/increment', 'ItemsController@incrementItemQuantity');
            $api->post('/items/{itemId}/decrement', 'ItemsController@decrementItemQuantity');

            // People
            $api->get('/people', 'PeopleController@indexAll');
            $api->get('/crews/{crewId}/people/{year}', 'PeopleController@indexForCrew');
    });
});
