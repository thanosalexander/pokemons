<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class PokemonProfile extends Model
{

    protected $fillable = [
        'front_default',
        'name',
        'base_experience',
        'height' ,
        'weight',
        'data',
        'is_king'
    ];


    protected $casts = [
        'data'=>'json',
        'is_king'=>'boolean',
        'height' =>'integer',
        'weight'=>'integer',
        'base_experience'=>'integer',
    ];

    protected $appends = [
        'sprite',
        'base_stat_sum',
        'moves',
        'sprites',
        'stats',
        'abilities'
    ];

    /**
     * Pokemon in which belongs
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function pokemon()
    {
        return $this->belongsTo(Pokemon::class);
    }

    public function getSpriteAttribute($value)
    {
        $sprite = $this->data['sprites']['front_default'];

        return isset($sprite) && $sprite
            ? $sprite
            : null;
    }

    public function getBaseStatSumAttribute($value)
    {
        $base_stat = collect($this->data['stats']);

        return $base_stat->sum('base_stat');
    }

    public function getMovesAttribute($value)
    {
        $moves = collect($this->data['moves']);

        return $moves->pluck('move.name');
    }

    public function getSpritesAttribute($value)
    {
        return collect($this->data['sprites']);
    }

    public function getStatsAttribute($value)
    {
        return collect($this->data['stats']);
    }

    public function getAbilitiesAttribute($value)
    {
        return collect($this->data['abilities']);
    }


    /**
     * @param Builder $query
     * @return Builder
     */
    public function scopeKing($query)
    {
        return $query->where('is_king',1);
    }
}
