<template>
    <headline></headline>
    <div class="login_lg">
        <div class="login_header">
            <span class="login_title">登&nbsp&nbsp&nbsp陆</span>
        </div>
        <div class="login_content">
            <div class="login_common">
                <span class="span_md">账号:</span>
                <input class="login_input" style="margin-top:60px" type="text" placeholder="" v-model="username">
            </div>
            <div class="login_common">
                <span class="span_md">密码:</span>
                <input class="login_input" type="password" placeholder="" v-model="password"></div>
            <div class="login_common">
                <button @click="login">sign in</button>
                <a v-link="{path:'register'}"><button>sign up</button></a>
            </div>
            <p>{{msg}}</p>
        </div>
    </div>
</template>
<style>
    .login_lg {
        position: relative;
        width: 500px;
        height: 400px;
        border: 1px solid #000;
        margin: 0 auto;
        margin-top: 20px;
        background: #eee;
    }

    .login_header {
        height: 60px;
        border-bottom: 1px solid #000;
        text-align: center;
        line-height: 60px;
    }

    .login_title {
        font-size: 20px;
        font-weight: bold;
        color: #000;
    }

    .login_content {
        text-align: center;
    }

    .login_input {
        width: 200px;
        height: 30px;
        font-size: 20px;
    }
    .login_common{
        margin-top: 20px;
    }
    .span_md{
        display: inline-block;
        font-size: 20px;
        text-align: right;
        width: 100px;
        margin-left: -60px;
    }
</style>
<script>
    import headLine from './headLine.vue';
    export default{
        data(){
            return {
                msg: 'hello vue',
                username:'',
                password:''
            }
        },
        components: {
            "headline": headLine
        },
        methods:{
            login:function () {
                this.$http.post('/api/login',{"username":this.username,"password":this.password}).then(function (res) {
                    var data = res.data;
                    this.msg=data;
                    localStorage.user_id=data[0]._id;
                    router.go({path:'/home'})
                },function (res) {
                    var data = res.data;
                    this.msg=data.error;
                })
            }
        }
    }
</script>
