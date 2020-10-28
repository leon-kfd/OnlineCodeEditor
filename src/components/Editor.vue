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
import 'codemirror/theme/material-darker.css'
import expand from 'emmet'
import { debounce } from '@/utils/helper'
export type modeType = 'javascript' | 'htmlmixed' | 'css'

function getWord (line: string, ch: number): [string, number] {
  const getNearTagChar = (str: string): string => {
    for (let i = str.length - 1; i > 0; i--) {
      if (str[i] === '>' || str[i] === '<') return str[i]
    }
    return str[0] || '<'
  }
  // 光标位于行末或单词末尾
  if (ch === line.length || (line.length > ch + 1 && (/\s/.test(line[ch]) || line[ch] === '<'))) {
    let i
    for (i = ch - 1; i >= 0; i--) {
      if (/\s/.test(line[i]) || (line[i] === '>' && getNearTagChar(line.slice(0, i)) === '<')) {
        break
      }
    }
    return [line.slice(i + 1, ch), i + 1]
  }
  return ['', 0]
}

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
    let cmInstance: CodeMirror.EditorFromTextArea
    const editor = ref(document.createElement('textarea'))

    onMounted(async () => {
      let word: string, wordIndex: number
      cmInstance = CodeMirror.fromTextArea(editor.value, props.options)
      cmInstance.setOption('mode', props.mode)
      cmInstance.setOption('theme', 'material-darker')
      cmInstance.setValue(props.editorValue)
      cmInstance.on('change', (coder) => {
        if (props.mode === 'htmlmixed') {
          // HTML模式下使用Emmet
          const { line: lineIndex, ch } = coder.getCursor()
          const line = coder.getLine(lineIndex)
          const wordResult = getWord(line, ch)
          word = wordResult[0]
          wordIndex = wordResult[1]
        }
        context.emit('update:editorValue', coder.getValue())
      })
      cmInstance.on('change', debounce(() => {
        context.emit('debounce-update')
      }, 5000) as (instance: CodeMirror.Editor) => void)

      if (props.mode === 'htmlmixed') {
        cmInstance.setOption('extraKeys', {
          Tab: function (coder) {
            const indent = coder.getOption('indentUnit') || 2
            const spaces = Array(indent + 1).join(' ')
            if (!word) {
              coder.replaceSelection(spaces)
            } else {
              try {
                const emmet = expand(word)
                const { line, ch } = coder.getCursor()
                coder.setSelection({ line, ch }, { line, ch: wordIndex })
                const formatterEmmet = emmet.split('\n').map((line, index) => {
                  if (index > 0) {
                    line = line.replace(/\t/g, spaces)
                    line = Array(wordIndex + 1).join(' ') + line
                  }
                  return line
                }).join('\n')
                coder.replaceSelection(formatterEmmet)
              } catch (e) {
                console.error(e)
                coder.replaceSelection(spaces)
              }
            }
          }
        })
      }
    })

    watch(() => props.mode, (val) => {
      cmInstance.setOption('mode', val)
    })

    return {
      editor,
      handleToggleFold () {
        context.emit('fold', !props.isFold)
      },
      handleCodeMirrorRefresh () {
        cmInstance.refresh()
      }
    }
  }
}
</script>

<style scoped lang="scss">
$bgColor: #212121;
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
      height: 28px;
      line-height: 28px;
      color: #f9f9fa;
      font-size: 18px;
      font-weight: bold;
      width: 100%;
      flex: 1;
    }
    .fold {
      font-size: 24px;
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
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
}
</style>
