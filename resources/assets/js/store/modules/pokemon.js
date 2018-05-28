import axios from 'axios';

const state = {
    id: null,
    name: '',
};

const mutations = {
    SET_POKEMON: (state, payload) => {
        state.id = payload.id;
        state.name = payload.name;
    }
};

const actions = {
    getPokemonData: (context, payoload) => {
        axios.get( route('api.pokemons') )
            .then( (response) => {
                context.commit('SET_POKEMON', response.data);
            });
    }
};

export default {
    state,
    mutations,
    actions
}