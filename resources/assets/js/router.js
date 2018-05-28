import VueRouter from 'vue-router';


const routes = [
    {path:'/', component: require('./components/Welcome')}
]


export default new VueRouter({
    routes: routes,
    mode: 'history',
    scrollBehavior: function (to, from, savedPosition) {
        return savedPosition || { x: 0, y: 0 }
    }
});