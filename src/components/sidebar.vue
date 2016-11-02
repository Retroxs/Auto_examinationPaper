<template>
    <div class="sidebar">
        <img class="user_img" src="../../static/images/user_icon.png">
        <span class="user_info">{{username}}</span>
        <ul>
            <li><a v-link="{name:'list'}">我的题库</a></li>
            <li><a v-link="{name:'create'}">录入题目</a></li>
            <li><a v-link="{name:'list'}">智能组卷</a></li>
            <li><a v-link="{name:'list'}">手动组卷</a></li>
            <li><a v-link="{name:'markdown'}">批量录入</a></li>
        </ul>
    </div>
</template>
<style>
    .sidebar{
        width: 15%;
        height: 600px;
        border-right: 2px solid #000;
        float: left;
        text-align: center;
    }
    .user_img{
        display: block;
        margin: 20px auto;
    }
    .user_info{
        display: block;
        margin: 0 auto;
        margin-bottom: 20px;
    }
    li{
        line-height: 30px;
    }
    a:focus{
        color: #e96153;
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
        props:[
            'username'
        ]
    }
</script>
