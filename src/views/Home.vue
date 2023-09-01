<template>
  <div class="home" :style="{ height: homeHeight }">
    <Header @open-setting="handleOpenSetting" @refresh="handleRefresh"></Header>
    <MobileTab v-if="isMobileView" :codeList="codeList" v-model:active="mobileTabActive" />
    <main>
      <div
        class="code-wrapper"
        v-if="refreshCodeWrapper && mobileTabActive !== 3"
        v-resize="codeWrapperResizeOption"
        @resize="handleCodeWrapperResize"
        v-size-observer="sizeObserverOption"
        @sizechange="handleCodeWrapperSizeChange">
        <Code
          ref="codeWrapper"
          :isMobileView="isMobileView"
          :codeWrapperHeight="codeWrapperHeight"
          :list="codeList"
          :mobileTabActive="mobileTabActive"
          @send-message="sendMessage">
        </Code>
      </div>
      <div class="iframe-wrapper =" v-show="!isMobileView || mobileTabActive === 3">
        <iframe
          id="iframe"
          :src="iframeURL"
          frameborder="0"
          width="100%"
          height="100%">
        </iframe>
      </div>
    </main>
    <Footer></Footer>
    <Setting ref="settingEl" :isMobileView="isMobileView" @close="handleSettingClose"></Setting>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw, ref, watch, onMounted, onUnmounted, reactive, nextTick } from 'vue'
import { useStore } from 'vuex'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Code from '@/components/Code.vue'
import Setting from '@/components/Setting.vue'
import MobileTab from '@/components/MobileTab.vue'
import { setWidth } from '@/utils/dom'
const MOBILE_VIEW_SIZE = 500
const PREFIX = './'
// const PREFIX = '/coder/'
export default defineComponent({
  name: 'Home',
  components: {
    Header,
    Footer,
    Setting,
    Code,
    MobileTab
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
      codeWrapperResizeOption: reactive({
        direction: ['right'],
        lineWidth: 4,
        lineColor: '#b99944',
        immediate: true
      }),
      sizeObserverOption: {
        wait: 200
      },
      codeWrapperHeight: ref(0),
      iframeURL: ref(`${PREFIX}/iframe.html`),
      homeHeight: ref('100vh')
    }

    watch(() => store.state.setting.cssPreprocessor, (val: string) => {
      state.codeList.value[1].title = val.toUpperCase()
      state.codeList.value[1].mode = val === 'scss' ? 'sass' : 'css'
    })

    const methods = {
      async sendMessage (refresh = false) {
        if (refresh) {
          state.iframeURL.value = `${PREFIX}/iframe.html?t=${+new Date()}`
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
          target.postMessage(data, location.origin + `${PREFIX}/iframe.html`)
        }
      },
      handleCodeWrapperSizeChange (e: any) {
        const { contentRect } = e
        const { height } = contentRect
        state.codeWrapperHeight.value = height
        this.cmRefresh()
      },
      handleCodeWrapperResize (e: any) {
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

    const isMobileView = ref(false)
    const refreshCodeWrapper = ref(true)
    const mobileTabActive = ref(0)
    const setMobileView = () => {
      isMobileView.value = window.innerWidth < MOBILE_VIEW_SIZE
      state.homeHeight.value = window.innerHeight + 'px'
    }
    watch(isMobileView, async (val) => {
      if (val) {
        state.codeWrapperResizeOption.direction = []
      } else {
        state.codeWrapperResizeOption.direction = ['right']
      }
      refreshCodeWrapper.value = false
      await nextTick()
      refreshCodeWrapper.value = true
      settingEl.value.close()
    }, {
      immediate: true
    })

    // mobile layout
    onMounted(() => {
      setMobileView()
      window.addEventListener('resize', setMobileView)
    })
    onUnmounted(() => {
      window.removeEventListener('resize', setMobileView)
    })

    return {
      ...state,
      ...methods,
      settingEl,
      codeWrapper,
      isMobileView,
      refreshCodeWrapper,
      mobileTabActive
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
    position: relative;
    .code-wrapper {
      width: 40%;
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .iframe-wrapper {
      width: 60%;
      height: 100%;
      position: relative;
    }
  }
}
@media screen and (max-width: $mobileWidth) {
  .home {
    main {
      .code-wrapper {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .iframe-wrapper {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
}
</style>
