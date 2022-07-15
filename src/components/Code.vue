<template>
  <div
    class="editor-item"
    v-for="(item,index) in list"
    v-show="!isMobileView || mobileTabActive === index"
    :key="item"
    :class="{ fold: foldArr[index], [`editor-item-${index + 1}`]: true }"
    v-resize="resizeOption[index]"
    @resize="handleCSSWrapperResize">
    <div class="wrapper">
      <div class="header">
        <div class="title">{{item.title}}</div>
        <i class="fold" :class="{ active: foldArr[index] }" @click="handleToggleFold(index)">
          <svg
            class="icon"
            viewBox="0 0 1024 1024"
            width="1em"
            height="1em"
            fill="currentColor">
            <path d="M510.464 644.608l278.848-278.848 39.68 39.552L530.176 704h-39.552L192 405.312l39.616-39.552 278.848 278.848z"></path>
          </svg>
        </i>
      </div>
      <div class="textarea-wrapper">
        <Editor
          v-model:editorValue="item.code"
          :mode="item.mode"
          :ref="(el) => { codeMirror[index] = el }"
          @debounce-update="sendMessage"></Editor>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { setHeight, getHeight } from '@/utils/dom'
import Editor from './Editor.vue'
export default defineComponent({
  name: 'Code',
  components: {
    Editor
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    codeWrapperHeight: {
      type: Number,
      default: window.innerHeight
    },
    mobileTabActive: {
      type: Number,
      default: 0
    },
    isMobileView: {
      type: Boolean
    }
  },
  emits: ['send-message'],
  setup(props, { emit }) {
    const codeMirror = ref([])
    const foldArr = ref([false, false, false])
    const classArr = ['.editor-item-1', '.editor-item-2', '.editor-item-3']
    const handleToggleFold = (index: number) => {
      const fold = !foldArr.value[index]
      const isFoldLength = foldArr.value.filter(item => item).length
      const minHeightPercent = 32 / props.codeWrapperHeight * 100
      if (fold) {
        if (isFoldLength >= 2) return
        let nextIndex: number
        if (isFoldLength === 0) {
          nextIndex = index < 2 ? index + 1 : 1
        } else if (isFoldLength === 1) {
          const foldIndex = foldArr.value.findIndex(item => item)
          nextIndex = [0, 1, 2].filter(i => i !== index).filter(i => i !== foldIndex)[0]
        } else {
          nextIndex = 0
        }
        const offsetHeightPercent = getHeight(classArr[index]) / props.codeWrapperHeight * 100
        const nextIndexHeightPercent = getHeight(classArr[nextIndex]) / props.codeWrapperHeight * 100
        setHeight(classArr[index], `${minHeightPercent}%`)
        setHeight(classArr[nextIndex], `${nextIndexHeightPercent + offsetHeightPercent - minHeightPercent}%`)
        foldArr.value[index] = fold
      } else {
        if (isFoldLength === 1) {
          classArr.map(i => setHeight(i, '33.3%'))
        } else if (isFoldLength === 2) {
          const unFoldIndex = foldArr.value.findIndex(item => !item)
          const halfHeightPercent = (100 - minHeightPercent) / 2
          setHeight(classArr[index], `${halfHeightPercent}%`)
          setHeight(classArr[unFoldIndex], `${halfHeightPercent}%`)
        }
        foldArr.value[index] = fold
      }
    }
    const refresh = () => {
      codeMirror.value.map((item: any) => item.handleCodeMirrorRefresh())
    }
    const checkFolding = () => {
      classArr.map((item, index) => {
        foldArr.value[index] = getHeight(item) < 29
      })
    }
    const handleCSSWrapperResize = (e: any) => {
      const { target, direction, resizeHeightPercent, moveOffsetPercent } = e
      if (direction === 'top') {
        setHeight(target, `${resizeHeightPercent}%`)
        setHeight('.editor-item-1', `${moveOffsetPercent}%`)
      } else if (direction === 'bottom') {
        setHeight(target, `${resizeHeightPercent}%`)
        setHeight('.editor-item-3', `${100 - moveOffsetPercent}%`)
      }
      checkFolding()
      refresh()
    }

    const sendMessage = () => {
      emit('send-message')
    }
    return {
      foldArr,
      handleToggleFold,
      refresh,
      handleCSSWrapperResize,
      resizeOption: [
        { direction: [] },
        {
          direction: ['top', 'bottom'],
          lineColor: '#fff',
          tipLineColor: '#fff',
          needParentNodeOffset: false
        },
        { direction: [] },
      ],
      sendMessage,
      codeMirror
    }
  }
})
</script>
<style lang="scss" scoped>

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
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: $deepDark;
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
}
@media screen and (max-width: $mobileWidth) {
  .editor-item {
    position: absolute !important;
    width: 100%;
    height: 100% !important;
    top: -1px;
    left: 0;
    .wrapper {
      .header {
        display: none;
      }
    }
  }
}
</style>
