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
Vue.use(VueRouter);

var app=Vue.extend(App);
var router=new VueRouter();

router.map({
    '/home':{
        name:home,
        component:home,
    },
    '/login':{
        component:login,
    },
    '/register':{
        component:register,
    }


})

//设置默认情况下打开的页面
router.redirect({
    '/':'login'
});

router.start(app,'#app');
//暴露路由接口调试
window.router = router;