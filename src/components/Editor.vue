<template>
  <textarea ref="editor"></textarea>
</template>

<script lang="ts">
import { onMounted, ref, PropType, watch } from 'vue'
import expand from 'emmet'
import { debounce } from '@/utils/helper'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/sass/sass.js'

type modeType = 'javascript' | 'htmlmixed' | 'css'

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
          lineNumbers: true,
          line: true,
          indentUnit: 2
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
        if (props.mode === 'htmlmixed' || props.mode === 'css') {
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

      if (props.mode === 'htmlmixed' || props.mode === 'css') {
        cmInstance.setOption('extraKeys', {
          Tab: function (coder) {
            const indent = coder.getOption('indentUnit') || 2
            const spaces = Array(indent + 1).join(' ')
            if (!word) {
              coder.replaceSelection(spaces)
            } else {
              try {
                const typeMap = {
                  htmlmixed: 'markup',
                  css: 'stylesheet'
                }
                const emmet = expand(word, { type: typeMap[props.mode] })
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
      handleCodeMirrorRefresh () {
        cmInstance.refresh()
      }
    }
  }
}
</script>
<style>
.CodeMirror {
  height: 100%;
  font-family: Monaco, MonoSpace;
  font-size: 15px;
  line-height: 1.4;
}
</style>
