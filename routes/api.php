<?php

use Illuminate\Http\Request;

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


Route::get('pokemons','PokemonsController@index')->name('api.pokemons.index');
Route::get('pokemons/refresh','PokemonsController@refresh')->name('api.pokemons.refresh');
Route::get('pokemons/king','PokemonsController@getKing')->name('api.pokemons.kings.get');
Route::post('pokemons/king','PokemonsController@setKing')->name('api.pokemons.kings.post');
