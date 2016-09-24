<template>
    <div style="border-bottom:1px solid #ccc">
        <span>文本题目录入</span><br>
        <span>为保证页面流畅性，建议每次录入控制在50道题目以内</span><button @click="cc">保存</button><button @click="aa">发到数据库</button>
    </div>
    <div id="editor">
        <textarea v-model="input" debounce=500></textarea>
        <div v-html="output_html"></div>
    </div>
</template>

<script>
    import marked from 'marked'
    export default {
        data () {
            return {
                input: '# Helzzz World!'
            }
        },
//        filters: {
//            marked_html: marked,
//            marked_json: marked.lexer,
//
//        },
        computed:{
            output_html:function () {
                    return marked(this.input)
            },
            output_json:function () {
                return marked.lexer(this.input)
            },
        },

        methods:{
            cc:function () {
                var a = this.output_json
                console.log(a[0].text)
                console.log(a[0].text.match(/\[(选择|判断|填空|解答|简答|计算)]\[(知识点)]\[(易|中|难)]([\s\S*]+)答案[:|：]([\s\S*]+)/));
            },
            aa:function(){
                var a = this.output_json
                this.$http.post('/api/bank/57dde781113489039ead0a76/create', {
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
<style>
    #editor {
        margin: 0;
        height: 700px;
        font-family: 'Helvetica Neue', Arial, sans-serif;
        color: #333;
    }
    textarea, #editor div {
        display: inline-block;
        width: 49%;
        height: 100%;
        vertical-align: top;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        padding: 0 20px;
    }

    textarea {
        border: none;
        border-right: 1px solid #ccc;
        resize: none;
        outline: none;
        background-color: #f6f6f6;
        font-size: 14px;
        font-family: 'Monaco', courier, monospace;
        padding: 20px;
    }

    code {
        color: #f66;
    }
</style>