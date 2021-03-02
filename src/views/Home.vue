<template>
  <div class="home">
    <Header @open-setting="handleOpenSetting" @refresh="handleRefresh"></Header>
    <main>
      <div class="code-wrapper" v-resize:right="codeWrapperResizeOption" @resize="handleCodeWrapperResize" v-size-observer="sizeObserverOption" @sizechange="handleCodeWrapperSizeChange">
        <Code ref="codeWrapper" :codeWrapperHeight="codeWrapperHeight" :list="codeList" @send-message="sendMessage"></Code>
      </div>
      <div class="iframe-wrapper">
        <iframe id="iframe" :src="iframeURL" frameborder="0" width="100%" height="100%"></iframe>
      </div>
    </main>
    <Footer></Footer>
    <Setting ref="settingEl" @close="handleSettingClose"></Setting>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw, ref } from 'vue'
import { useStore } from 'vuex'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Code from '@/components/Code.vue'
import Setting from '@/components/Setting.vue'
import { setWidth } from '@/utils/dom'
export default defineComponent({
  name: 'Home',
  components: {
    Header,
    Footer,
    Setting,
    Code
  },
  setup () {
    const settingEl = ref()
    const codeWrapper = ref()
    const store = useStore()

    const state = {
      codeList: ref([
        {
          title: 'HTML',
          mode: 'htmlmixed',
          code: ''
        },
        {
          title: 'CSS',
          mode: 'css',
          code: ''
        },
        {
          title: 'Javascript',
          mode: 'javascript',
          code: ''
        }
      ]),
      codeWrapperResizeOption: {
        lineWidth: 4,
        lineColor: '#b99944',
        immediate: true
      },
      sizeObserverOption: {
        wait: 200
      },
      codeWrapperHeight: ref(0),
      iframeURL: ref('./iframe.html')
    }

    const methods = {
      async sendMessage (refresh = false) {
        if (refresh) {
          state.iframeURL.value = `./iframe.html?t=${+new Date()}`
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(1)
            }, 2000)
          })
        }
        const iframe = document.querySelector('#iframe') as HTMLIFrameElement
        const target = iframe.contentWindow
        const [html, css, javascript] = state.codeList.value
        const setting = toRaw(store.state.setting)
        const data = {
          type: 'editorChange',
          data: {
            html: toRaw(html),
            css: toRaw(css),
            javascript: toRaw(javascript),
            setting
          }
        }
        if (target) {
          target.postMessage(data, location.origin + '/iframe.html')
        }
      },
      handleCodeWrapperSizeChange (e) {
        const { contentRect } = e
        const { height } = contentRect
        state.codeWrapperHeight.value = height
        this.cmRefresh()
      },
      handleCodeWrapperResize (e) {
        const { target, resizeWidthPercent, moveOffsetPercent } = e
        setWidth(target, `${resizeWidthPercent}%`)
        setWidth('.iframe-wrapper', `${100 - moveOffsetPercent}%`)
      },
      cmRefresh () {
        codeWrapper.value.refresh()
      },
      async handleOpenSetting () {
        settingEl.value.open()
      },
      handleSettingClose () {
        methods.sendMessage(true)
      },
      handleRefresh () {
        methods.sendMessage(true)
      }
    }

    return {
      ...state,
      ...methods,
      settingEl,
      codeWrapper
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
    }
    .iframe-wrapper {
      width: 60%;
      height: 100%;
      position: relative;
    }
  }
}
</style>
