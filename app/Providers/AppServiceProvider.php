<?php

namespace App\Providers;

use App\Repositories\Pokemons\PokemonsInterface;
use App\Repositories\Pokemons\PokemonsRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(PokemonsInterface::class,PokemonsRepository::class);
    }
}
