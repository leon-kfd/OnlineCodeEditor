<template>
  <div class="home">
    <Header @open-setting="handleOpenSetting"></Header>
    <main>
      <div class="code-wrapper" v-resize:right="codeWrapperResizeOption" @resize="handleCodeWrapperResize" v-size-observer="sizeObserverOption" @sizechange="handleCodeWrapperSizeChange">
        <div class="editor-item html-wrapper" :class="{fold: foldArr[0]}">
          <Editor
            v-model:editorValue="html.code"
            :mode="html.mode"
            :title="html.title"
            :isFold="foldArr[0]"
            ref="htmlCM"
            @fold="handleFold(0, $event)"
            @debounce-update="sendMessage"></Editor>
        </div>
        <div class="editor-item resize-item css-wrapper" :class="{fold: foldArr[1]}" v-resize="resizeOption" @resize="handleCSSWrapperResize">
          <Editor
            v-model:editorValue="css.code"
            :mode="css.mode"
            :title="css.title"
            :isFold="foldArr[1]"
            ref="cssCM"
            @fold="handleFold(1, $event)"
            @debounce-update="sendMessage"></Editor>
        </div>
        <div class="editor-item javascript-wrapper" :class="{fold: foldArr[2]}">
          <Editor
            v-model:editorValue="javascript.code"
            :mode="javascript.mode"
            :title="javascript.title"
            :isFold="foldArr[2]"
            ref="javascriptCM"
            @fold="handleFold(2, $event)"
            @debounce-update="sendMessage"></Editor>
        </div>
      </div>
      <div class="iframe-wrapper">
        <iframe id="iframe" src="./iframe.html" frameborder="0" width="100%" height="100%"></iframe>
      </div>
    </main>
    <Footer></Footer>
    <Setting ref="setting"></Setting>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw, ref, reactive } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Editor from '@/components/Editor.vue'
import Setting from '@/components/Setting.vue'
import { setWidth, setHeight, getHeight } from '@/utils/dom'
// import { scss2css } from '@/utils/helper'
export default defineComponent({
  name: 'Home',
  components: {
    Header,
    Footer,
    Editor,
    Setting
  },
  setup () {
    const htmlCM = ref()
    const cssCM = ref()
    const javascriptCM = ref()
    const setting = ref()

    const state = {
      html: reactive({
        title: 'HTML',
        mode: 'htmlmixed',
        code: ''
      }),
      css: reactive({
        title: 'CSS',
        mode: 'css',
        code: ''
      }),
      javascript: reactive({
        title: 'Javascript',
        mode: 'javascript',
        code: ''
      }),
      codeWrapperResizeOption: {
        lineWidth: 4,
        lineColor: '#b99944',
        immediate: true
      },
      resizeOption: {
        direction: ['top', 'bottom'],
        lineColor: '#fff',
        tipLineColor: '#fff',
        needParentNodeOffset: false
      },
      sizeObserverOption: {
        wait: 200
      },
      foldArr: reactive([false, false, false]),
      codeWrapperHeight: 0
    }

    const methods = {
      async sendMessage () {
        const iframe = document.querySelector('#iframe') as HTMLIFrameElement
        const target = iframe.contentWindow
        const { html, css, javascript } = state
        const data = {
          type: 'editorChange',
          data: {
            html: toRaw(html),
            css: toRaw(css),
            javascript: toRaw(javascript)
          }
        }
        if (target) {
          target.postMessage(data, location.origin + '/iframe.html')
        }
      },
      handleCodeWrapperSizeChange (e) {
        const { contentRect } = e
        const { height } = contentRect
        state.codeWrapperHeight = height
        this.cmRefresh()
      },
      handleCodeWrapperResize (e) {
        const { target, resizeWidthPercent, moveOffsetPercent } = e
        setWidth(target, `${resizeWidthPercent}%`)
        setWidth('.iframe-wrapper', `${100 - moveOffsetPercent}%`)
      },
      handleCSSWrapperResize (e) {
        const { target, direction, resizeHeightPercent, moveOffsetPercent } = e
        if (direction === 'top') {
          setHeight(target, `${resizeHeightPercent}%`)
          setHeight('.html-wrapper', `${moveOffsetPercent}%`)
        } else if (direction === 'bottom') {
          setHeight(target, `${resizeHeightPercent}%`)
          setHeight('.javascript-wrapper', `${100 - moveOffsetPercent}%`)
        }
        this.checkFolding()
        this.cmRefresh()
      },
      handleFold (index, fold) {
        const classArr = ['.html-wrapper', '.css-wrapper', '.javascript-wrapper']
        const isFoldLength = state.foldArr.filter(item => item).length
        const minHeightPercent = 32 / state.codeWrapperHeight * 100
        if (fold) {
          if (isFoldLength >= 2) return
          let nextIndex
          if (isFoldLength === 0) {
            nextIndex = index < 2 ? index + 1 : 1
          } else if (isFoldLength === 1) {
            const foldIndex = state.foldArr.findIndex(item => item)
            nextIndex = [0, 1, 2].filter(i => i !== index).filter(i => i !== foldIndex)[0]
          }
          const offsetHeightPercent = getHeight(classArr[index]) / state.codeWrapperHeight * 100
          const nextIndexHeightPercent = getHeight(classArr[nextIndex]) / state.codeWrapperHeight * 100
          setHeight(classArr[index], `${minHeightPercent}%`)
          setHeight(classArr[nextIndex], `${nextIndexHeightPercent + offsetHeightPercent - minHeightPercent}%`)
          state.foldArr[index] = fold
        } else {
          if (isFoldLength === 1) {
            classArr.map(i => setHeight(i, '33.3%'))
          } else if (isFoldLength === 2) {
            const unFoldIndex = state.foldArr.findIndex(item => !item)
            const halfHeightPercent = (100 - minHeightPercent) / 2
            setHeight(classArr[index], `${halfHeightPercent}%`)
            setHeight(classArr[unFoldIndex], `${halfHeightPercent}%`)
          }
          state.foldArr[index] = fold
        }
      },
      checkFolding () {
        const classArr = ['.html-wrapper', '.css-wrapper', '.javascript-wrapper']
        classArr.map((item, index) => {
          state.foldArr[index] = getHeight(item) < 29
        })
      },
      cmRefresh () {
        htmlCM.value.handleCodeMirrorRefresh()
        cssCM.value.handleCodeMirrorRefresh()
        javascriptCM.value.handleCodeMirrorRefresh()
      },
      handleOpenSetting () {
        setting.value.open()
      }
    }

    return {
      ...state,
      ...methods,
      htmlCM,
      cssCM,
      javascriptCM,
      setting
    }
  }
})
</script>
<style lang="scss" scoped>
.home {
  width:100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  main {
    width:100%;
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    flex: 1;
    overflow: hidden;
    .code-wrapper {
      width: 40%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .editor-item {
        width: 100%;
        height: 33.3%;
        min-height: 32px;
        &.fold {
          height: 36px;
        }
        &.resize-item {
          border-top: 2px solid #f9f9fa;
          border-bottom: 2px solid #f9f9fa;
        }
      }
    }
    .iframe-wrapper {
      width: 60%;
      height: 100%;
      position: relative;
    }
  }
}
</style>
