<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePokemonProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pokemon_profiles', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('pokemon_id')->nullable();
            $table->string('front_default')->nullable();
            $table->string('name')->nullable();
            $table->integer('base_experience')->nullable();
            $table->integer('height' )->nullable();
            $table->integer('weight')->nullable();
            $table->boolean('is_king')->default(false);
            $table->json('data');
            $table->timestamps();

            $table->foreign('pokemon_id')->references('id')->on('pokemons')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pokemon_profiles');
    }
}
