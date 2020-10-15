<template>
  <div class="home">
    <div class="code-wrapper" v-resize:right="codeWrapperResizeOption" @resize="handleCodeWrapperResize" v-size-observer="sizeObserverOption" @sizechange="handleCodeWrapperSizeChange">
      <div class="editor-item html-wrapper" :class="{fold: foldArr[0]}">
        <Editor v-model:editorValue="html.code" :mode="html.mode" :title="html.title" :isFold="foldArr[0]" @fold="handleFold(0, $event)"></Editor>
      </div>
      <div class="editor-item resize-item css-wrapper" :class="{fold: foldArr[1]}" v-resize="resizeOption" @resize="handleCSSWrapperResize">
        <Editor v-model:editorValue="css.code" :mode="css.mode" :title="css.title" :isFold="foldArr[1]" @fold="handleFold(1, $event)"></Editor>
      </div>
      <div class="editor-item javascript-wrapper" :class="{fold: foldArr[2]}">
        <Editor v-model:editorValue="javascript.code" :mode="javascript.mode" :title="javascript.title" :isFold="foldArr[2]" @fold="handleFold(2, $event)"></Editor>
      </div>
    </div>
    <div class="iframe-wrapper"></div>
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
      codeWrapperResizeOption: {
        lineColor: '#fa4',
        tipLineColor: '#fa4'
      },
      resizeOption: {
        direction: ['top', 'bottom'],
        lineColor: '#fff',
        tipLineColor: '#fff'
      },
      sizeObserverOption: {
        wait: 200
      },
      foldArr: [false, false, false],
      codeWrapperHeight: 0
    }
  },
  methods: {
    handleCodeWrapperSizeChange (e) {
      const { contentRect } = e
      const { height } = contentRect
      this.codeWrapperHeight = height
    },
    handleCodeWrapperResize (e) {
      const { target, resizeWidthPercent, moveOffsetPercent } = e
      this.setWidth(target, `${resizeWidthPercent}%`)
      this.setWidth('.iframe-wrapper', `${100 - moveOffsetPercent}%`)
    },
    handleCSSWrapperResize (e) {
      const { target, direction, resizeHeightPercent, moveOffsetPercent } = e
      if (direction === 'top') {
        this.setHeight(target, `${resizeHeightPercent}%`)
        this.setHeight('.html-wrapper', `${moveOffsetPercent}%`)
      } else if (direction === 'bottom') {
        this.setHeight(target, `${resizeHeightPercent}%`)
        this.setHeight('.javascript-wrapper', `${100 - moveOffsetPercent}%`)
      }
      this.checkFolding()
    },
    handleFold (index, fold) {
      const classArr = ['.html-wrapper', '.css-wrapper', '.javascript-wrapper']
      const isFoldLength = this.foldArr.filter(item => item).length
      const minHeightPercent = 32 / this.codeWrapperHeight * 100
      if (fold) {
        if (isFoldLength >= 2) return
        this.foldArr[index] = fold
        let nextIndex
        if (isFoldLength === 0) {
          nextIndex = index < 2 ? index + 1 : 1
        } else if (isFoldLength === 1) {
          const foldIndex = this.foldArr.findIndex(item => item)
          nextIndex = [0, 1, 2].filter(i => i !== index).filter(i => i !== foldIndex)[0]
        }
        const offsetHeightPercent = this.getHeight(classArr[index]) / this.codeWrapperHeight * 100
        const nextIndexHeightPercent = this.getHeight(classArr[nextIndex]) / this.codeWrapperHeight * 100
        this.setHeight(classArr[index], `${minHeightPercent}%`)
        this.setHeight(classArr[nextIndex], `${nextIndexHeightPercent + offsetHeightPercent - minHeightPercent}%`)
      } else {
        this.foldArr[index] = fold
        if (isFoldLength === 1) {
          classArr.map(i => this.setHeight(i, '33.3%'))
        } else if (isFoldLength === 2) {
          const unFoldIndex = this.foldArr.findIndex(item => !item)
          const halfHeightPercent = (100 - minHeightPercent) / 2
          this.setHeight(classArr[index], `${halfHeightPercent}%`)
          this.setHeight(classArr[unFoldIndex], `${halfHeightPercent}%`)
        }
      }
    },
    checkFolding () {
      const classArr = ['.html-wrapper', '.css-wrapper', '.javascript-wrapper']
      classArr.map((item, index) => {
        this.foldArr[index] = this.getHeight(item) < 33
      })
    },
    setWidth (el, width) {
      const targetEl = typeof el === 'string' ? document.querySelector(el) as HTMLElement : el
      if (targetEl) targetEl.style.width = width
    },
    setHeight (el, height) {
      const targetEl = typeof el === 'string' ? document.querySelector(el) as HTMLElement : el
      if (targetEl) targetEl.style.height = height
    },
    getHeight (el) {
      const targetEl = typeof el === 'string' ? document.querySelector(el) as HTMLElement : el
      if (targetEl) {
        const height = window.getComputedStyle(targetEl).height
        return +height.replace('px', '')
      } else {
        return 0
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.home {
  width:100vw;
  height: 100vh;
  display: flex;
  flex-wrap: nowrap;
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
}
</style>
