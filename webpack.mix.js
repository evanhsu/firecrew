const mix = require('laravel-mix');

mix.setPublicPath('public')
    .ts('resources/js/index.tsx', 'js')
    .react()
    .sass('resources/sass/app.scss', 'css')
    .webpackConfig({
        resolve: {
            fallback: {
                "process": require.resolve("process/browser")
            }
        },
        plugins: [
            new (require('webpack')).ProvidePlugin({
                process: 'process/browser',
            })
        ]
    });
