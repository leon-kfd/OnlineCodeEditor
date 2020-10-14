<template>
  <div class="home">
    <div class="code-wrapper" v-size-observer bind:sizechange="handleCodeWrapperSizeChange">
      <div class="editor-item html-wrapper" :class="{fold: html.isFold}" v-size-observer>
        <Editor v-model:editorValue="html.code" :mode="html.mode" :title="html.title" v-model:isFold="html.isFold"></Editor>
      </div>
      <div class="editor-item resize-item css-wrapper" :class="{fold: css.isFold}" v-resize="resizeOption" @resize="handleResize">
        <Editor v-model:editorValue="css.code" :mode="css.mode" :title="css.title" v-model:isFold="css.isFold"></Editor>
      </div>
      <div class="editor-item javascript-wrapper" :class="{fold: javascript.isFold}">
        <Editor v-model:editorValue="javascript.code" :mode="javascript.mode" :title="javascript.title" v-model:isFold="javascript.isFold"></Editor>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Editor from '@/components/Editor.vue' // @ is an alias to /src
export default defineComponent({
  name: 'Home',
  components: {
    Editor
  },
  data () {
    return {
      html: {
        title: 'HTML',
        mode: 'htmlmixed',
        code: ''
      },
      css: {
        title: 'CSS',
        mode: 'css',
        code: ''
      },
      javascript: {
        title: 'Javascript',
        mode: 'javascript',
        code: ''
      },
      resizeOption: {
        direction: ['top', 'bottom'],
        lineColor: '#fff',
        tipLineColor: '#fff'
      }
    }
  },
  methods: {
    handleCodeWrapperSizeChange (e) {
      console.log(9999, e)
    },
    getCodeWrapperHeight () {
      const codeWrapperEl = document.querySelector('.code-wrapper') as HTMLElement
      if (codeWrapperEl) {
        return window.getComputedStyle(codeWrapperEl, 'height')
      } else {
        return 0
      }
    },
    handleResize (e) {
      const { target, direction, resizeHeightPercent, moveOffsetPercent } = e
      if (direction === 'top') {
        target.style.height = `${resizeHeightPercent}%`
        const htmlEl = document.querySelector('.html-wrapper') as HTMLElement
        if (htmlEl) {
          htmlEl.style.height = `${moveOffsetPercent}%`
        }
      } else if (direction === 'bottom') {
        target.style.height = `${resizeHeightPercent}%`
        const htmlEl = document.querySelector('.javascript-wrapper') as HTMLElement
        if (htmlEl) {
          htmlEl.style.height = `${100 - moveOffsetPercent}%`
        }
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.code-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .editor-item {
    width: 100%;
    height: 33.3%;
    min-height: 36px;
    &.fold {
      height: 36px;
    }
    &.resize-item {
      border-top: 2px solid #f9f9fa;
      border-bottom: 2px solid #f9f9fa;
    }
  }
}
</style>
