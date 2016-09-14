<template>
    <headline :username=username></headline>
    <div>
    <ul>
        <li v-for="item in items">
            <span>{{item.type}}</span><br>
            <span>{{item.subject}}</span><br>
            <span>{{item.question}}</span><br>
            <span>{{item.answer}}</span><br>
            <span>{{item.level}}</span><br>
        </li>

    </ul>
        </div>
</template>
<style>
</style>
<script>
    import headLine from './headLine.vue';
    export default{
        data(){
            return{
                msg:'hello vue',
                username:'',
                items:''
            }
        },
        components:{
            "headline":headLine
        },
        ready(){
            this.$http.get('/api/auth').then(function (res) {
                var user=res.data.username;
                this.username=user;
//                router.go({path:'/home'})
                this.$http.get('/api/bank/'+localStorage.user_id+'/list').then(function (res) {
                    var data = res.data;
                    this.items=data;
                },function (res) {
                    var data = res.data;
                    this.bank=data;
                })

            },function (res) {
                router.go({path:'/login'})

            })
        }
    }
</script>

