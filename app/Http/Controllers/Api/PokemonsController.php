<?php

namespace App\Http\Controllers\Api;

use App\PokemonProfile;
use App\Repositories\Pokemons\PokemonsInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PokemonsController extends Controller
{
    /**
     * @var PokemonsInterface
     */
    private $pokemons;

    /**
     * PokemonsController constructor.
     * @param PokemonsInterface $pokemons
     */
    public function __construct(PokemonsInterface $pokemons)
    {
        $this->pokemons = $pokemons;
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        return $this->pokemons->get($request);
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function refresh(Request $request)
    {
        return $this->pokemons->refresh($request);
    }

    /**
     * @return mixed
     */
    public function setKing()
    {
        return $this->pokemons->setKing();
    }

    /**
     * @return mixed
     */
    public function getKing()
    {
        return $this->pokemons->getKing();
    }
}
