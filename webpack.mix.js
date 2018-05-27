let mix = require('laravel-mix');


/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */



mix

    .webpackConfig({

    })

    .js('resources/assets/js/pokemons.js', 'public/js')
    .sass('resources/assets/sass/pokemons.scss', 'public/css')



    /******************************************************************************
     *
     * SOURCEMAPS
     *
     */
    .sourceMaps();

    