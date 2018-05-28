<template>
    <div class="row">


        <div class="col-md-12">
            <div class="jumbotron text-center">
                <h1>PokeKing App</h1>
                <img src="/img/Pokemon_2D_logo.svg" alt="" class="img-fluid pokemon-logo">
            </div>
        </div>


        <div class="col-md-12">
            <div class="card card-default">

                <div class="card-header text-center">
                    <b-btn @click="selectKing"  v-b-tooltip.hover title="Select King"  class="btn btn-lg btn-danger">
                        <font-awesome-icon :icon="icon" />
                    </b-btn>
                </div>

                <div class="card-header">
                    <div class="btn-group pull-right">
                        <b-btn id="refresh-button" class="btn btn-sm btn-success" v-b-tooltip.hover title="Refresh Data" @click.prevent="refresh" >
                            <i class="fa fa-refresh"></i>
                        </b-btn>
                    </div>
                    <span class="clearfix"></span>
                </div>



                <div v-if="isLoading" class="card-header">
                    <b-progress  :value="progress_bar_percent" variant="success" :max="100" :precision="2" show-value striped :animated="animate" class="mb-2"></b-progress>
                    <span class="clearfix"></span>
                </div>


                <div class="card-body">
                    <div class="table-responsive">
                        <v-server-table url="/api/pokemons" :columns="columns" :options="options" ref="table"></v-server-table>

                    </div>
                </div>


            </div>
        </div>

        <div v-if="king" class="col-md-12 mt-5">
            <div class="card card-default">

                <div class="card-header text-center">

                    <h3 class="card-header">King of Pokemons</h3>
                    <font-awesome-icon :icon="icon" size="8x" style="color: red;" />
                </div>


                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3 text-center">
                            <img :src="king.sprite" class="img-fluid" alt="">
                            <h3 v-text="king.name"></h3>
                        </div>
                        <div class="col-md-9">
                            <b-card no-body>
                                <b-tabs card>
                                    <b-tab title="Details" active>
                                        <dl class="row">

                                            <dt class="col-sm-3">Base Experience</dt>
                                            <dd class="col-sm-9" v-text="king.base_experience"></dd>

                                            <dt class="col-sm-3">Height</dt>
                                            <dd class="col-sm-9" v-text="king.height"></dd>

                                            <dt class="col-sm-3">Weight</dt>
                                            <dd class="col-sm-9" v-text="king.weight"></dd>

                                            <dt class="col-sm-3">Base Stats (Sum)</dt>
                                            <dd class="col-sm-9" v-text="king.base_stat_sum"></dd>

                                        </dl>

                                    </b-tab>
                                    <b-tab title="Sprites">
                                        <img v-for="sprite in king.sprites" :src="sprite" class="img-fluid" alt="">
                                    </b-tab>

                                    <b-tab title="Statistics">
                                        <ul class="list-unstyled">

                                            <li v-for="stat in king.stats" >

                                                <span>
                                                    <strong>{{stat.stat.name}}</strong>
                                                    {{stat.base_stat}}
                                                </span>
                                            </li>


                                        </ul>
                                    </b-tab>

                                    <b-tab title="Moves">
                                        <li v-for="move in king.moves" >
                                            <strong v-text="move"></strong>
                                        </li>
                                    </b-tab>

                                    <b-tab title="Abilities">
                                        <ul class="list-unstyled">

                                            <li v-for="ability in king.abilities" >

                                                <strong>{{ability.ability.name}}</strong>
                                                <span  class="badge badge-danger">
                                                     Hidden
                                                </span>
                                            </li>


                                        </ul>

                                    </b-tab>

                                </b-tabs>
                            </b-card>

                        </div>
                    </div>
                </div>


                <div class="card-footer">

                </div>

            </div>
        </div>

    </div>
</template>

<script type="text/jsx">
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    import { faCrown } from '@fortawesome/fontawesome-free-solid'

    export default {


        computed: {
            icon () {
                return faCrown
            }
        },

        components: {
            FontAwesomeIcon
        },

        created(){

            let _this = this

            var pusher = new Pusher(process.env.MIX_PUSHER_APP_KEY, {
                cluster: 'eu',
                encrypted: true
            });


            Echo.channel('pokemons')

                .listen('PokemonsRefreshedCompleted', (e) => {
                    toastr.success('DB REFRESHED!')
                    _this.isLoading = false
                    _this.progress_bar_percent = 0
                    _this.$refs.table.refresh();
                })
                .listen('PokemonsRefreshedProgressChanged', (e) => {
                    if(_this.isLoading===false) _this.isLoading = true
                    _this.progress_bar_percent=parseFloat(e.data.percent)
                });

            this.getKing();
        },


        data(){
            return {
                king: {},
                animate: true,
                progress_bar_percent: 0,
                isLoading: false,
                columns: [
                    'sprite',
                    'name',
                    'base_experience',
                    'height',
                    'weight',
                ],
                options: {
                    headings : {
                        id: 'Sprite',
                        name: 'Name',
                        url: 'URL',
                        base_experience: 'Base Experience',
                        height: 'Height',
                        weight: 'Weight'
                    },
                    highlightMatches: true,
                    sortable: ['id','name', 'base_experience','weight','height'],
                    filterable: ['id','name', 'base_experience','weight','height'],
                    skin: 'table table-vue table-striped table-bordered table-hover dt-responsive nowrap',
                    orderBy: {
                        ascending:false,
                        column: 'weight'
                    },
                    sortIcon: { base:'fa', up:'fa-sort-up', down:'fa-sort-down', is:'fa-sort' },
                    templates: {
                        url: (h,row)=> {
                            return <a target="_blank" href={row.url}>{row.url}</a>
                        },
                        sprite: (h,row)=> {
                            return <img src={row.sprite} class="img-fluid sprite" />
                        }
                    }
                },
            }
        },


        methods: {

            refresh(event){

                $('#refresh-button').find('i').removeClass('fa-refresh').addClass('fa-spinner fa-spin')

                this.isLoading = true

                axios.get('/api/pokemons/refresh')

                    .then(({ data }) => {
                        $('#refresh-button').find('i').removeClass('fa-spinner').removeClass('fa-spin').addClass('fa-refresh')
                        toastr.success('Pokemons are retrieved now! You will be notified when process is done!')
                    })

                    .catch(err =>{
                        this.isLoading = false
                        toastr.error('Pokemons could not be retrieved!')
                    })
            },

            getKing(){

                let _this = this;

                axios.get('/api/pokemons/king')
                    .then(response => {
                        _this.king = response.data
                    })
                    .catch(err =>{
                        toastr.error('Pokemon King could not be set!')
                    })
            },

            selectKing(pokemon){

                let _this = this;

                axios.post('/api/pokemons/king')
                    .then(response => {
                        _this.king = response.data
                    })
                    .catch(err =>{
                        toastr.error('Pokemon King could not be set!')
                    })
            },
        }

    }
</script>

<style >

    .sprite {
        max-height: 50px;
    }


    .pokemon-logo {
        margin: auto;
        max-width: 200px;
    }

    .VueTables__highlight b {
        color: orangered;
    }


    .VueTables__table  th:hover{
        cursor: pointer;
        background-color: orangered;
        color: black;
        font-weight: bolder;
    }
</style>