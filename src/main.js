/**
 * Created by HUI on 16/9/9.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import vueResource from 'vue-resource';
Vue.use(vueResource);

import App from './app.vue';
import home from './components/home.vue';
import login from './components/login.vue';
import register from './components/register.vue';
import list from './components/list.vue';
import create from './components/create.vue';
import markdown from './components/markbook.vue';
Vue.use(VueRouter);

var app=Vue.extend(App);
var router=new VueRouter();

router.map({
    '/home':{
        name:home,
        component:home,
        subRoutes:{
            '/list': {
                name: 'list',
                component: list
            },
            '/create': {
                name: 'create',
                component: create
            }
        }
    },
    '/login':{
        name:'login',
        component:login,
    },
    '/register':{
        component:register,
    },
    '/markdown':{
        component:markdown,
    }


})

//设置默认情况下打开的页面
router.redirect({
    '/':'login'
});

router.start(app,'#app');
//暴露路由接口调试
window.router = router;