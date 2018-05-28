import {ServerTable, ClientTable, Event} from 'vue-tables-2';
import VueRouter from 'vue-router'
import Vuex from 'vuex';
import store from './store';
import router from './router'
import Meta from 'vue-meta'
import BootstrapVue from 'bootstrap-vue'
import Echo from 'laravel-echo'


window._ = require('lodash');
window.Popper = require('popper.js').default;
window.axios = require('axios');
window.toastr=require('toastr');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.moment = require('moment-timezone')


/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */


try {

    window.$ = window.jQuery = require('jquery');

    require('bootstrap');

} catch (e) {}



/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}


// DECLARE Vue
window.Vue = require('vue');

Vue.use(VueRouter);
Vue.use(ClientTable, {}, false,'bootstrap4','default');
Vue.use(ServerTable, {}, false,'bootstrap4','default');
Vue.use(Event, {}, false,'bootstrap4','default');
Vue.use(Meta)
Vue.use(BootstrapVue);



window.Pusher = require('pusher-js');
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    encrypted: true
});


const app = new Vue({
    el: "#app",
    router,
    store,
    render: h => h(require('./components/Layout')),
})

