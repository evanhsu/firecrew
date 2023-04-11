const mix = require('laravel-mix');

mix.setPublicPath('public')
    .ts('resources/js/index.tsx', 'js')
    .react()
    .sass('resources/sass/app.scss', 'css');
