<template>
    <div class="content">
        <!--<ul>-->
            <!--<li v-for="item in items">-->
                <!--<span>类型</span><span>{{item.type}}</span><br>-->
                <!--<span>课程</span><span>{{item.subject}}</span><br>-->
                <!--<span>题目</span><span>{{item.question}}</span><br>-->
                <!--<span>答案</span><span>{{item.answer}}</span><br>-->
                <!--<span>难度</span><span>{{item.level}}</span><br>-->
                <!--<button @click="deleteQ(item._id,item)">删除</button>-->
            <!--</li>-->
        <!--</ul>-->

        <div class="listBox" v-for="item in items">
            <span>{{$index+1}}</span>
            <span>[{{item.type}}]</span>
            <span>{{item.question}}</span><br>
            <span>答案:</span><span>{{item.answer}}</span><br>
            <span>难度:</span><span>{{item.level}}</span><br>
            <button @click="deleteQ(item._id,item)">删除</button>
        </div>
    </div>
</template>
<style>
    .listBox{
        margin-left: 10%;
        width: 75%;
        height: 100px;
        background-color: #fff;
        margin-top: 10px;
    }
</style>
<script>
    export default{
        data(){
            return {
                msg: 'hello vue',
                items: ''
            }
        },
        components: {},
        ready(){
            this.$http.get('/api/bank/' + localStorage.user_id + '/list').then(function (res) {
                var data = res.data;
                this.items = data;
            }, function (res) {
                var data = res.data;
                this.bank = data;
            })
        },

        methods:{
            deleteQ:function (id,item) {
                this.$http.get('/api/bank/'+id+'/delete').then(function (res) {
                    var data = res.data;
                    this.msg = data;
                    this.items.$remove(item)
                }, function (res) {
                    var data = res.data;
                    this.msg = data;
                })
            }
        }
    }
</script>
