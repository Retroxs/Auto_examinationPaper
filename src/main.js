/**
 * Created by HUI on 16/9/9.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './app.vue';
import home from './components/home.vue'
Vue.use(VueRouter);

var app=Vue.extend(App);
var router=new VueRouter();

router.map({
    '/home':{
        component:home,

    }

})

//设置默认情况下打开的页面
router.redirect({
    '/':'home'
});

router.start(app,'#app');
//暴露路由接口调试
window.router = router;