<template>
    <headline></headline>
    <div class="login_lg">
        <div class="login_header">
            <span class="login_title">注&nbsp&nbsp&nbsp册</span>
        </div>
        <div class="login_content">
            <div class="login_common">
                <span class="span_md">用户名:</span>
                <input class="login_input" style="margin-top:60px" type="text" placeholder="" v-model="username">
            </div>
            <div class="login_common">
                <span class="span_md">密码:</span>
                <input class="login_input" type="password" placeholder="" v-model="password"></div>
            <div class="login_common">
                <span class="span_md">确认密码:</span>
                <input class="login_input" type="password" placeholder=""></div>
            <div class="login_common">
                <a v-link="{path:'login'}"><button><-back</button></a>
                <button @click="register">continue</button>
            </div>
            <p>{{msg}}</p>
        </div>
    </div>

</template>
<style>
</style>
<script>
    import headLine from './headLine.vue';

    export default{
        data(){
            return {
                msg: '',
                username:'',
                password:''
            }
        },
        components: {
            "headline": headLine
        },
        methods:{
            register:function () {
                this.$http.post('/api/register',{"username":this.username,"password":this.password}).then(function (res) {
                    var data = res.data;
                    this.msg=data;
                },function (res) {
                    var data = res.data;
                    this.msg=data.error;
                })
            }
        }
    }
</script>
