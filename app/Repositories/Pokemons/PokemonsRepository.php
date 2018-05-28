<?php
/**
 * Created by PhpStorm.
 * User: thanosalexander
 * Date: 27/5/2018
 * Time: 11:45 πμ
 */

namespace App\Repositories\Pokemons;


use App\Jobs\RefreshPokemons;
use App\Pokemon;
use App\PokemonProfile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use PokePHP\PokeApi;

class PokemonsRepository implements PokemonsInterface
{

    /**
     * @param $request
     * @return array
     */
    public function get($request)
    {
        $query = $request->get('query');
        $limit = $request->get('limit',10);
        $page = $request->get('page',1);
        $orderItem = $request->get('orderBy');
        $orderType = $request->get('ascending');
        $searchable_fields = [
            'id','name','weight','height','base_experience'
        ];

        /** @var Builder $pokemons */
        $pokemons = PokemonProfile::query();

        if (isset($query) && $query) {

            foreach ($searchable_fields as $searchable_field):

                $pokemons->orWhere($searchable_field,'LIKE',"%{$query}%");

            endforeach;
        }

        $count = $pokemons->count();

        $pokemons->limit($limit)->skip($limit * ($page-1));

        if (isset($orderItem)):
            $direction = $orderType==1?"ASC":"DESC";
            $pokemons->orderBy($orderItem,$direction);
        endif;

        $results = $pokemons->get()->toArray();

        return [
            'data'=>$results,
            'count'=>$count
        ];
    }

    /**
     * @param $request
     * @return string
     */
    public function refresh($request)
    {
        RefreshPokemons::dispatch();

        return "Job is dispatched!";
    }


    public function setKing()
    {
        /** @var PokemonProfile $pokemon_profile */
        $pokemon_profile = PokemonProfile::all()->sortByDesc('base_stat_sum')->first();

        if(is_null($pokemon_profile)) return null;

        $pokemon_profile->update([
            'is_king'=>true
        ]);

        return $pokemon_profile;
    }

    public function getKing()
    {
        /** @var PokemonProfile $pokemon_profile */
        $pokemon_profile = PokemonProfile::king()->first();

        if(is_null($pokemon_profile)) return [];

        return $pokemon_profile;
    }
}