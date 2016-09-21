<template>
        <headline :username=username></headline>
        <sidebar :username=username></sidebar>
        <router-view></router-view>
</template>
<style>
    .content {
        width: 80%;
        height: 600px;
        float: left;
        overflow: auto;
    }
</style>
<script>
    import headLine from './headLine.vue';
    import sidebar from './sidebar.vue';
    export default{
        data(){
            return {
                msg: 'hello vue',
                username: '',
                items:''
            }
        },
        components: {
            "headline": headLine,
            'sidebar': sidebar
        },
        ready(){
            this.$http.get('/api/auth').then(function (res) {
                var user = res.data.username;
                this.username = user;
//                router.go({path:'/home'})

            }, function (res) {
                router.go({path: '/login'})

            })
        }
    }
</script>

