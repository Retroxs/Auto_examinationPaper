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
                input: '[选择][常识][中]\n最好的组卷产品?\nA.云题库 \nB.腾讯 \nC.百度 \nD.阿里巴巴 \n答案：A \n\r[判断][常识][易] \n2014年2月有28天。 \n答案：正确 \n\r[填空][常识][中] \n2015年的前三个月依次分别有 __ 天， __ 天，和 __ 天。 \n答案：31，28，31 \n\r[简答][常识][难] \n一年哪几个月有31天？ \n答案：1月、3月、5月、7月、8月、10月、12月'
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
            aa:function(){
                var a = this.output_json
                for (var i=0 ; i<a.length;i++){
                    var bank = a[i].text.match(/\[(选择|判断|填空|解答|简答|计算)]\[([\s\S*]+)]\[(易|中|难)]([\s\S*]+)答案[:|：]([\s\S*]+)/);
                    this.$http.post('/api/bank/57dde781113489039ead0a76/create', {
                        "type": bank[1],
                        "subject": bank[2],
                        "isOption": true,
                        "question": bank[4],
                        "options": '111',
                        "answer": bank[5],
                        "level": bank[3]
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