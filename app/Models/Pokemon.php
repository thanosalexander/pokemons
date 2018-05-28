<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pokemon extends Model
{
    protected $table='pokemons';

    protected $fillable=[
      'name',
      'url'
    ];

    /**
     * Pokemon details
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function details()
    {
        return $this->hasOne(PokemonProfile::class,'pokemon_id','id');
    }
}
