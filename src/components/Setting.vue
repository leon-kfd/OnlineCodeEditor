<template>
  <AnimationDialog ref="dialog" :animationMode="true" customClass="setting-dialog" width="800px" height="600px">
    <div class="wrapper">
      <h3 class="title">Setting</h3>
      <div class="content">
        <div class="tabs-nav">
          <div class="item" :class="{active: index === activeTab}" v-for="(item,index) in tabs" :key="item" @click="handleSetTabActive(index)">{{item}}</div>
        </div>
        <div class="tabs-content">
          <div class="html-setting" v-if="activeTab === 0">// Html Setting</div>
          <div class="css-setting" v-if="activeTab === 1">// Css Setting</div>
          <div class="javascript-setting" v-if="activeTab === 2">// Javascript Setting</div>
        </div>
      </div>
    </div>
  </AnimationDialog>
</template>

<script>
import AnimationDialog from 'howdyjs/packages/animation-dialog'
// import AnimationDialog from 'howdyjs/lib/animation-dialog'
import { ref } from 'vue'
export default {
  components: {
    AnimationDialog
  },
  setup () {
    const dialog = ref()
    const state = {
      tabs: ['Html', 'CSS', 'Javascript'],
      activeTab: ref(0)
    }
    const methods = {
      handleSetTabActive (index) {
        state.activeTab.value = index
      },
      open () {
        dialog.value.open()
      },
      close () {
        dialog.value.close()
      }
    }
    return {
      ...state,
      ...methods,
      dialog
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  .title {
    margin-top: -4px;
  }
}
.content {
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
  flex: 1;
  padding: 10px 0;
  .tabs-nav {
    padding: 0 15px 0 40px;
    text-align: right;
    margin-right: 15px;
    border-right: 1px solid #404046;
    width: 130px;
    .item {
      height: 32px;
      line-height: 32px;
      margin-bottom: 10px;
      position: relative;
      cursor: pointer;
      &.active {
        font-weight: bold;
        &:after {
          position: absolute;
          content: '';
          right: -16px;
          top: 15%;
          height: 70%;
          width: 3px;
          background: sandybrown;
        }
      }
    }
  }
  .tabs-content {
    width: 100%;
    flex: 1;
  }
}
</style>

<style lang="scss">
.setting-dialog {
  .dialog-body {
    background: #262626;
    color: #fff;
  }
  .icon-close {
    .line {
      background: #fff !important;
    }
  }
}
</style>
