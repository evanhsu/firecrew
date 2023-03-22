const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 | https://laravel-mix.com
 | This is a wrapper around Webpack that ships with Laravel
 */

/*
 * This portion builds the StatusSummary react app.
 * There's also some unfinished work on an Inventory system here.
 * This React App uses the top-level package.json
 */
mix.setPublicPath('public')
    .ts('resources/js/index.tsx', 'js')
    .react()
    .sass('resources/sass/app.scss', 'css');

/*
 * The files in the static folder don't require any transpilation or bundling.
 * They should just be copied as-is into the public folder.
 * These files were all part of the original esri map view which is no longer used.
 */
// mix.copy('resources/js/static/', 'public/js');

/*
 * The map-frontend is a Typescript React project.
 * It's built outside the main project in the map-frontend folder.
 * It uses its own package.json file so that it can use newer packages without
 * having to update the entire legacy project.
 * You need to build the map-frontend separately (via `yarn build` in the map-frontend/ folder)
 * and then this step just copies the bundle into the Laravel public folder.
 */
// mix.copy('map-frontend/dist/', 'public/js/map');
