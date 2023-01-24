const mix = require("laravel-mix");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

/*
 * This portion builds the StatusSummary react app.
 * There's also some unfinished work on an Inventory system here.
 * This React App uses the top-level package.json
 */
mix.js("resources/js/app.js", "public/js")
    .sass("resources/sass/app.scss", "public/css")
    .react();

/*
 * The files in the static folder don't require any transpilation or bundling.
 * They should just be copied as-is into the public folder.
 */
mix.copy("resources/js/static/", "public/js");

/*
 * The map-frontend is a Typescript React project.
 * It's built outside the main project in the map-frontend folder.
 * It uses its own package.json file so that it can use newer packages without
 * having to update the entire legacy project.
 */
mix.override((webpackConfig) => {
    webpackConfig.module.rules.push({
        test: /\.m?js/,
        resolve: {
            fullySpecified: false,
        },
    });
});
mix.setPublicPath("public/")
    .ts("map-frontend/src/index.tsx", "/js")
    .react()
    .extract();
