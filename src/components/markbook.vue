<template>
    <div id="editor">
        <textarea v-model="input" debounce=500></textarea>
        <div v-html="output_html"></div>
    </div>
    {{output_json}}
    <button @click="cc">aa</button>
</template>

<script>
    import marked from 'marked'
    export default {
        data () {
            return {
                // note: changing this line won't causes changes
                // with hot-reload because the reloaded component
                // preserves its current state and we are modifying
                // its initial state.
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
                console.log(a)
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