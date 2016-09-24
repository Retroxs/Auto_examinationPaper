/**
 * Created by HUI on 16/9/9.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import vueResource from 'vue-resource';
import marked from 'marked';
Vue.use(vueResource);

import App from './app.vue';
import home from './components/home.vue';
import login from './components/login.vue';
import register from './components/register.vue';
import list from './components/list.vue';
import create from './components/create.vue';
import markdown from './components/markbook.vue';
Vue.use(VueRouter);
var renderer = new marked.Renderer();
marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});
renderer.paragraph = function (text) {
    if (text.match(/^\[(选择|判断|填空|解答|简答|计算)]\[知识点]\[(易|中|难)]/)) {

        // var a =text.toLowerCase().(/^\[(选择|判断|填空|解答|简答|计算)]\[知识点]\[(易|中|难)]/);
        var b =text.split(/\n/);
        var c = text.split(/答案(:|：)/)
        return '<span style="color: #ccc;">'+b[0]+'</span><br><span>'+b[1]+'</span><br><span>'+b[2]+'</span><br><span>'+b[3]+'</span><br><span>'+b[4]+'</span><br><span>'+b[5]+'</span><br><span>答案:'+c[2]+'</span><hr>'
    }
    else{
        return '<span style="color: #ccc;">error</span>'

    }
};
var app = Vue.extend(App);
var router = new VueRouter();

router.map({
    '/home': {
        name: home,
        component: home,
        subRoutes: {
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
    '/login': {
        name: 'login',
        component: login,
    },
    '/register': {
        component: register,
    },
    '/markdown': {
        component: markdown,
    }


})

//设置默认情况下打开的页面
router.redirect({
    '/': 'login'
});

router.start(app, '#app');
//暴露路由接口调试
window.router = router;