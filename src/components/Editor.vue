<template>
  <div class="wrapper">
    <div class="header">
      <div class="title">{{title}}</div>
      <i class="fold" :class="{active: isFold}" @click="handleToggleFold">
        <svg class="icon" viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
          <path d="M510.464 644.608l278.848-278.848 39.68 39.552L530.176 704h-39.552L192 405.312l39.616-39.552 278.848 278.848z"></path>
        </svg>
      </i>
    </div>
    <div class="textarea-wrapper">
      <textarea ref="editor"></textarea>
    </div>
  </div>
</template>

<script lang="ts">
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import { onMounted, ref, PropType, watch } from 'vue'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/sass/sass.js'
import 'codemirror/theme/material-palenight.css'
export type modeType = 'javascript' | 'html' | 'css'
export default {
  name: 'Editor',
  props: {
    title: {
      type: String
    },
    isFold: {
      type: Boolean,
      default: false
    },
    editorValue: {
      type: String,
      default: ''
    },
    mode: {
      type: String as PropType<modeType>,
      default: 'javascript'
    },
    options: {
      type: Object as PropType<CodeMirror.EditorConfiguration>,
      default: () => {
        return {
          tabSize: 2,
          lineNumbers: true,
          line: true
        }
      }
    }
  },
  setup (props, context) {
    let _CodeMirror: CodeMirror.EditorFromTextArea
    const editor = ref(document.createElement('textarea'))
    onMounted(async () => {
      _CodeMirror = CodeMirror.fromTextArea(editor.value, props.options)
      _CodeMirror.setOption('mode', props.mode)
      _CodeMirror.setOption('theme', 'material-palenight')
      _CodeMirror.setValue(props.editorValue)
      _CodeMirror.on('change', (coder) => {
        context.emit('update:value', coder.getValue())
      })
    })

    watch(() => props.mode, (val) => {
      _CodeMirror.setOption('mode', val)
    })

    return {
      editor,
      handleToggleFold () {
        context.emit('fold', !props.isFold)
      }
    }
  }
}
</script>

<style scoped lang="scss">
$bgColor: #292D3E;
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $bgColor;
  .header {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    height: 32px;
    padding: 0 20px;
    .title {
      height: 32px;
      line-height: 32px;
      color: #f9f9fa;
      font-size: 22px;
      font-weight: bold;
      width: 100%;
      flex: 1;
    }
    .fold {
      font-size: 30px;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: transform .4s cubic-bezier(0.075, 0.82, 0.165, 1);
      &.active {
        transform: rotate(-180deg);
      }
    }
  }
  .textarea-wrapper {
    width: 100%;
    height: 100%;
    flex: 1;
    overflow: hidden;
  }
}
</style>
<style>
.textarea-wrapper .CodeMirror {
  height: 100%;
}
</style>
