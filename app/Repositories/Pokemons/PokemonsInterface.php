<?php
/**
 * Created by PhpStorm.
 * User: thanosalexander
 * Date: 27/5/2018
 * Time: 11:45 πμ
 */

namespace App\Repositories\Pokemons;


interface PokemonsInterface
{
    public function get($request);
    public function refresh($request);
    public function setKing();
    public function getKing();
}