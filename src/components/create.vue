<template>
    <div class="content">
        <span>题目类型</span>
        <select v-model="type">
            <option value="选择" selected="selected">选择</option>
            <option value="判断">判断</option>
            <option value="填空">填空</option>
            <option value="简答">简答</option>
            <option value="解答">解答</option>
            <option value="计算">计算</option>
        </select><br>
        <span>课程</span><input type="text" value="高数" v-model="subject"><br>
        <span>是否选择题</span><span>是</span><input type="radio" v-model="isOption" name="isOption" value="true">
        <span>不是</span><input type="radio" v-model="isOption" name="isOption" value="false" checked><br>
        <span>题目</span><textarea rows="3" cols="20" v-model="question"></textarea><br>
        <span>选项</span><input type="text" v-model="options"><br>
        <span>答案</span><input type="text" v-model="answer"><br>
        <span>难度</span><input type="text" v-model="level"><br>
        {{msg}}
        <button @click="create">提交</button>
    </div>
</template>
<style>
</style>
<script>
    export default{
        data(){
            return {
                msg: 'hello vue'
            }
        },
        components: {},
        methods: {
            create: function () {
                this.$http.post('/api/bank/' + localStorage.user_id + '/create', {
                    "type": this.type,
                    "subject": this.subject,
                    "isOption": this.isOption,
                    "question": this.question,
                    "options": this.options,
                    "answer": this.answer,
                    "level": this.level
                }).then(function (res) {
                    var data = res.data;
                    this.msg = data.message;
                }, function (res) {
                    var data = res.data;
                    this.msg = data;
                })
            }
        }
    }
</script>
