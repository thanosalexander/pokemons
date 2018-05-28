<?php

namespace App\Jobs;

use App\Events\PokemonsRefreshedCompleted;
use App\Events\PokemonsRefreshedProgressChanged;
use App\Pokemon;
use Illuminate\Broadcasting\Channel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use PokePHP\PokeApi;

class RefreshPokemons implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        DB::beginTransaction();

        try
        {
            /** @var PokeApi $pokemon_api */
            $pokemon_api = new PokeApi;

            /** @var Collection $pokemons */
            $pokemons = Cache::rememberForever('pokemons', function() use ($pokemon_api){

                $limit =20;

                $offset = 20;

                $results = [];

                $response = json_decode($pokemon_api->resourceList('pokemon',$limit,$offset),true);

                $results=array_merge($results,$response['results']);

                while($response['next']!=null)
                {
                    $offset+=20;

                    $response = json_decode($pokemon_api->resourceList('pokemon',$limit,$offset),true);

                    $results=array_merge($results,$response['results']);
                }


                foreach ($results as $result)
                {
                    Pokemon::updateOrCreate($result);
                }

                return Pokemon::all();
            });


            $data = [
                'total'=>  $pokemons->count(),
                'current'=>0,
                'percent'=>0
            ];

            event(new PokemonsRefreshedProgressChanged($data));


            /** @var Pokemon $pokemons */
            foreach ($pokemons as $pokemon) {

                if ($data['current'] % 10 == 0) event(new PokemonsRefreshedProgressChanged($data));

                $data['current']+=1;

                $data['percent']= floatval(number_format(($data['current']*100) / $data['total'],2));

                $pokemon_response = json_decode($pokemon_api->resourceList('pokemon/'.$pokemon->name),true);

                if($pokemon_response['height'] >=50 && isset($pokemon_response['sprites']['front_default']) )
                {
                    $pokemon->details()->updateOrCreate([
                        'front_default'=>$pokemon_response['sprites']['front_default'],
                        'name'=>$pokemon_response['name'],
                        'base_experience'=>(int)$pokemon_response['base_experience'],
                        'height' =>(int)$pokemon_response['height'],
                        'weight'=>(int)$pokemon_response['weight'],
                        'data'=>array_only($pokemon_response,[
                            'abilities',
                            'forms',
                            'game_indices',
                            'held_items',
                            'location_area_encounters',
                            'moves',
                            'sprites',
                            'species',
                            'stats',
                            'types',
                        ]),
                    ]);

                }
            }


            event(new PokemonsRefreshedCompleted());

            DB::commit();
        }
        catch (\Exception $exception)
        {
            DB::rollBack();
        }
    }



}
