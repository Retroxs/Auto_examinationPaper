<template>
    <div class="headline">
        <span class="headline_title">云题库</span>
        <a class="headline_title" style="float:right" @click="logout"><span style="color:green">{{username}}&nbsp&nbsp&nbsp&nbsp</span>/logout</a>
    </div>
</template>
<style>
    .headline{
        width: 100%;
        height: 50px;
        background-color: #333;
        line-height: 50px;
    }
    .headline_title{
        font-size: 20px;
        font-weight: bold;
        color: #fff;

    }
</style>
<script>
    export default{
        data(){
            return{
                msg:'hello vue'
            }
        },
        components:{
        },
        methods:{
            logout:function () {
                this.$http.get('/api/logout').then(function (res) {
                    router.go({name:'login'})
                },function (res) {
                    router.go({name:"login"})
                })
            }
        },
        props:[
            'username'
        ]
    }
</script>
