import Echo from 'laravel-echo'
import Modernizr from 'modernizr';
import {trans} from "./filters"
import VeeValidate, { Validator } from 'vee-validate';
import messagesEn from './components/vue_validation_locales/en';
import messagesEl from './components/vue_validation_locales/el';
import {ServerTable, ClientTable, Event} from 'vue-tables-2';





const dictionary = {
    en:  messagesEn,
    el:  messagesEl
};

window._ = require('lodash');
window.Popper = require('popper.js').default;
window.bootbox = require('bootbox');




/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */


try {
    window.$ = window.jQuery = require('jquery');

    require('bootstrap');
} catch (e) {}


window.axios = require('axios');
window.toastr=require('toastr');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

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

window.io = require('socket.io-client');

if (typeof io !== 'undefined') {

    if(Laravel.socket_client===true) {
        window.Echo = new Echo({
            broadcaster: 'socket.io',
            host: Laravel.host,
            csrfToken: Laravel.csrfToken
        });
    }
}



window.Vue = require('vue');



Vue.use(require('vue-script2'));
Vue.use(require('vue-style2'));

Vue.use(VeeValidate);
Vue.prototype.$setErrorsFromResponse = function(errorResponse) {
    // only allow this function to be run if the validator exists
    if(!this.hasOwnProperty('$validator')) {
        return;
    }

    // clear errors
    this.$validator.errors.clear();

    // check if errors exist
    if(!errorResponse.hasOwnProperty('errors')) {
        return;
    }

    let errorFields = Object.keys(errorResponse.errors);

    // insert laravel errors
    errorFields.map(field => {
        let errorString = errorResponse.errors[field].join(', ');
        this.$validator.errors.add(field, errorString);
    });
};


Vue.use(ClientTable, {}, false,'bootstrap4','default');
Vue.use(ServerTable, {}, false,'bootstrap4','default');
Vue.use(Event, {}, false,'bootstrap4','default');


require('./libraries');
require('./media/Jcrop');
require('./media/imgpicker');
window.Clipboard = $.Clipboard = require('clipboard/dist/clipboard');
window.daterangepicker = require('bootstrap-daterangepicker')


axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
}, function (error) {
    // Do something with response error

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        //console.log(error.response.data);
        //console.log(error.response.status);
        //console.log(error.response.headers);

        if(error.response.status==403) toastr.error(error.response.data.message)

    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        //console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        //console.log('Error', error.message);
    }

    return Promise.reject(error);
});



/**
 * Banners
 */

Vue.component('frontend-advertised-banners',require('./components/frontend/advertised/banners/Banners.vue'));
Vue.component('frontend-advertiser-banners',require('./components/frontend/advertiser/banners/Banners.vue'));
Vue.component('frontend-banner',require('./components/frontend/advertised/banners/Banner'));
Vue.component('frontend-create-banner',require('./components/frontend/advertised/banners/Create.vue'));


/**
 * Textads
 */
Vue.component('frontend-textads',require('./components/frontend/advertised/textads/Textads.vue'));
Vue.component('frontend-textad',require('./components/frontend/advertised/textads/Textad.vue'));
Vue.component('frontend-create-textad',require('./components/frontend/advertised/textads/Create'));

/**
 * Statistics
 */
Vue.component('frontend-advertised-statistics',require('./components/frontend/advertised/stats/Statistics.vue'));
Vue.component('frontend-advertiser-statistics',require('./components/frontend/advertiser/stats/Statistics.vue'));

/**
 * Packages (Credits)
 */
Vue.component('frontend-packages',require('./components/frontend/advertised/credits/Packages.vue'));


/**
 * Categories
 */
Vue.component('frontend-categories',require('./components/frontend/categories/Categories.vue'));
Vue.component('frontend-category',require('./components/frontend/categories/Category.vue'));
Vue.component('frontend-create-category',require('./components/frontend/categories/Create'));


/**
 * Exclusions
 */
Vue.component('frontend-advertised-exclusions',require('./components/frontend/advertised/exclusions/Exclusions.vue'));
Vue.component('frontend-advertised-exclusion',require('./components/frontend/advertised/exclusions/Exclusion.vue'));

Vue.component('frontend-advertiser-exclusions',require('./components/frontend/advertiser/exclusions/Exclusions.vue'));
Vue.component('frontend-advertiser-exclusion',require('./components/frontend/advertiser/exclusions/Exclusion.vue'));

/**
 * Transactions
 */
Vue.component('frontend-transactions',require('./components/frontend/transactions/Transactions.vue'));




/**
 * Websites
 */
Vue.component('frontend-websites',require('./components/frontend/advertiser/websites/Websites.vue'));
Vue.component('frontend-website',require('./components/frontend/advertiser/websites/Website'));
Vue.component('frontend-create-website',require('./components/frontend/advertiser/websites/Create'));


/**
 * Threads (messages)
 */
Vue.component('frontend-threads',require('./components/frontend/messages/Threads.vue'));
Vue.component('frontend-new-thread',require('./components/frontend/messages/Thread.vue'));

/**
 * Trash
 */
Vue.component('frontend-trash',require('./components/frontend/trashes/Trashes.vue'));

Vue.component('test',require('./components/Test'));


/**
 *
 * General
 */



const app = new Vue({
    el: '#app',

    mounted(){

        function findBootstrapEnvironment() {
            var envs = ["xs", "sm", "md", "lg"],
                doc = window.document,
                temp = doc.createElement("div");

            doc.body.appendChild(temp);

            for (var i = envs.length - 1; i >= 0; i--) {
                var env = envs[i];

                temp.className = "hidden-" + env;

                if (temp.offsetParent === null) {
                    doc.body.removeChild(temp);
                    return env;
                }
            }
            return "";
        }

        var resizeTimer;
        var before,after;

        $(document).ready(function()
        {
            $(document).tooltip({
                selector: "[data-toggle=tooltip]",
            });


            if(window.location.pathname==='/'){

                $('body').addClass('landpage');
            }
            else{

                $('body').addClass('client')
            }


            if (window.location.hash == '#_=_'){
                history.replaceState
                    ? history.replaceState(null, null, window.location.href.split('#')[0])
                    : window.location.hash = '';
            }

            let errors = window.Laravel.errors;

            if(errors.length!==0)
            {
                if(errors.modal) $(errors.modal[0]).modal('show');
            }

            if(findBootstrapEnvironment()=='xs' || findBootstrapEnvironment()=='sm'){
                $('#sidebar-collapse').addClass('small');
                $('#sidebar-toggle').addClass('text-center');
            }


            $(window).resize(function () {
                if (resizeTimer) {
                    clearTimeout(resizeTimer);
                } else {
                    before=findBootstrapEnvironment();
                }

                resizeTimer = setTimeout(function() {
                    resizeTimer = null;



                    after=findBootstrapEnvironment();

                    if(before=='xs' || before=='sm'){
                        if(after!='xs' || after!='sm'){

                            $('#sidebar-toggle').removeClass('text-center');

                            $('#sidebar-collapse').removeClass('small');

                            $('#sidebar-toggle').find('span').removeClass('rotate');
                        }
                        else{

                        }
                    }
                    else{
                        if(after=='xs' || after=='sm'){

                            $('#sidebar-toggle').addClass('text-center');
                            $('#sidebar-collapse').addClass('small');
                            $('#sidebar-toggle').find('span').removeClass('rotate');
                        }
                        else{

                        }
                    }

                }, 500);
            });

            $('#sidebar-toggle').click(function(e){

                if($('#sidebar-toggle').find('span').hasClass("rotate"))
                {
                    $(this).find('span').removeClass('rotate');
                }
                else
                {
                    $(this).find('span').addClass('rotate');
                }

                if($('#sidebar-collapse').hasClass("small"))
                {
                    $(this).removeClass('text-center');
                    $('#sidebar-collapse').removeClass('small');
                }
                else
                {
                    $('#sidebar-toggle').addClass('text-center');
                    $('#sidebar-collapse').addClass('small');
                }
            });


            $('#sidebar-collapse ul .top,#sidebar-collapse ul .sub,#account_wrap').click(function(e){
                var url = $(this).find('a').attr('href');
                window.location=url;
            });

            $('#my_account,#administrator').click(function(e){
                var url = $(this).find('a').attr('href');
                window.location=url;
            });


        });

        Validator.localize(window.Laravel.locale,dictionary[window.Laravel.locale]);
    },

    data(){
        return {

        }
    },

});
