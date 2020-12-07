<template>
  <AnimationDialog ref="dialog" :animationMode="true" customClass="setting-dialog" width="800px" height="600px" @beforeClose="handleClose">
    <div class="wrapper">
      <h3 class="title">Setting</h3>
      <div class="content">
        <div class="tabs-nav">
          <div class="item" :class="{active: index === activeTab}" v-for="(item,index) in tabs" :key="item" @click="handleSetTabActive(index)">{{item}}</div>
        </div>
        <div class="tabs-content">
          <div class="html-setting" v-if="activeTab === 0">
            <!-- // Html Setting -->
            <div class="form-item">
              <div class="label">Stuff to &lt;head&gt;</div>
              <div class="form-content">
                <textarea v-model="headStuff" cols="30" rows="6" placeholder="e.g. <meta>, <link>, <script>"></textarea>
              </div>
            </div>
          </div>
          <div class="css-setting" v-if="activeTab === 1">
            <!-- // CSS Setting -->
            <div class="form-item">
              <div class="label">CSS Preprocessor</div>
              <div class="content">
                <select v-model="cssPreprocessor">
                  <option value="css">None</option>
                  <option value="scss">SCSS</option>
                </select>
              </div>
            </div>
            <div class="form-item">
              <div class="label">CSS CDN</div>
              <div class="form-content">
                <div class="input-list-item" v-for="(item,index) in cssCDN" :key="index">
                  <input type="text" v-model="item.address" placeholder="Enter CDN address">
                  <div class="delete-btn" @click="handleRemoveCssCDN(index)">
                    <svg viewBox="0 0 1024 1024" width="20" height="20">
                      <path d="M793.6 102.4l-179.2 0 0-25.6c0-42.3424-34.4576-76.8-76.8-76.8l-102.4 0c-42.3424 0-76.8 34.4576-76.8 76.8l0 25.6-179.2 0c-42.3424 0-76.8 34.4576-76.8 76.8l0 51.2c0 33.3824 21.4016 61.8496 51.2 72.3968l0 644.4032c0 42.3424 34.4576 76.8 76.8 76.8l512 0c42.3424 0 76.8-34.4576 76.8-76.8l0-644.4032c29.7984-10.5472 51.2-39.0144 51.2-72.3968l0-51.2c0-42.3424-34.4576-76.8-76.8-76.8zM409.6 76.8c0-14.1312 11.4688-25.6 25.6-25.6l102.4 0c14.1312 0 25.6 11.4688 25.6 25.6l0 25.6-153.6 0 0-25.6zM742.4 972.8l-512 0c-14.1312 0-25.6-11.4688-25.6-25.6l0-640 563.2 0 0 640c0 14.1312-11.4688 25.6-25.6 25.6zM819.2 230.4c0 14.1312-11.4688 25.6-25.6 25.6l-614.4 0c-14.1312 0-25.6-11.4688-25.6-25.6l0-51.2c0-14.1312 11.4688-25.6 25.6-25.6l614.4 0c14.1312 0 25.6 11.4688 25.6 25.6l0 51.2z" fill="currentColor"></path>
                      <path d="M640 358.4c-14.1312 0-25.6 11.4688-25.6 25.6l0 512c0 14.1312 11.4688 25.6 25.6 25.6s25.6-11.4688 25.6-25.6l0-512c0-14.1312-11.4688-25.6-25.6-25.6z" fill="currentColor"></path>
                      <path d="M486.4 358.4c-14.1312 0-25.6 11.4688-25.6 25.6l0 512c0 14.1312 11.4688 25.6 25.6 25.6s25.6-11.4688 25.6-25.6l0-512c0-14.1312-11.4688-25.6-25.6-25.6z" fill="currentColor"></path>
                      <path d="M332.8 358.4c-14.1312 0-25.6 11.4688-25.6 25.6l0 512c0 14.1312 11.4688 25.6 25.6 25.6s25.6-11.4688 25.6-25.6l0-512c0-14.1312-11.4688-25.6-25.6-25.6z" fill="currentColor"></path></svg>
                  </div>
                </div>
                <div class="input-list-item" @click="handleAddCssCDN">
                  <button class="btn btn-new">Add new one</button>
                </div>
              </div>
            </div>
          </div>
          <div class="javascript-setting" v-if="activeTab === 2">
            <div class="form-item">
              <div class="label">Javascript CDN</div>
              <div class="form-content">
                <div class="input-list-item" v-for="(item,index) in jsCDN" :key="index">
                  <input type="text" v-model="item.address" placeholder="Enter CDN address">
                  <div class="delete-btn" @click="handleRemoveJsCDN(index)">
                    <svg viewBox="0 0 1024 1024" width="20" height="20">
                      <path d="M793.6 102.4l-179.2 0 0-25.6c0-42.3424-34.4576-76.8-76.8-76.8l-102.4 0c-42.3424 0-76.8 34.4576-76.8 76.8l0 25.6-179.2 0c-42.3424 0-76.8 34.4576-76.8 76.8l0 51.2c0 33.3824 21.4016 61.8496 51.2 72.3968l0 644.4032c0 42.3424 34.4576 76.8 76.8 76.8l512 0c42.3424 0 76.8-34.4576 76.8-76.8l0-644.4032c29.7984-10.5472 51.2-39.0144 51.2-72.3968l0-51.2c0-42.3424-34.4576-76.8-76.8-76.8zM409.6 76.8c0-14.1312 11.4688-25.6 25.6-25.6l102.4 0c14.1312 0 25.6 11.4688 25.6 25.6l0 25.6-153.6 0 0-25.6zM742.4 972.8l-512 0c-14.1312 0-25.6-11.4688-25.6-25.6l0-640 563.2 0 0 640c0 14.1312-11.4688 25.6-25.6 25.6zM819.2 230.4c0 14.1312-11.4688 25.6-25.6 25.6l-614.4 0c-14.1312 0-25.6-11.4688-25.6-25.6l0-51.2c0-14.1312 11.4688-25.6 25.6-25.6l614.4 0c14.1312 0 25.6 11.4688 25.6 25.6l0 51.2z" fill="currentColor"></path>
                      <path d="M640 358.4c-14.1312 0-25.6 11.4688-25.6 25.6l0 512c0 14.1312 11.4688 25.6 25.6 25.6s25.6-11.4688 25.6-25.6l0-512c0-14.1312-11.4688-25.6-25.6-25.6z" fill="currentColor"></path>
                      <path d="M486.4 358.4c-14.1312 0-25.6 11.4688-25.6 25.6l0 512c0 14.1312 11.4688 25.6 25.6 25.6s25.6-11.4688 25.6-25.6l0-512c0-14.1312-11.4688-25.6-25.6-25.6z" fill="currentColor"></path>
                      <path d="M332.8 358.4c-14.1312 0-25.6 11.4688-25.6 25.6l0 512c0 14.1312 11.4688 25.6 25.6 25.6s25.6-11.4688 25.6-25.6l0-512c0-14.1312-11.4688-25.6-25.6-25.6z" fill="currentColor"></path></svg>
                  </div>
                </div>
                <div class="input-list-item">
                  <button class="btn btn-new" @click="handleAddJsCDN">Add new one</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AnimationDialog>
</template>

<script lang="ts">
import AnimationDialog from 'howdyjs/packages/animation-dialog'
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { SettingType } from './Setting'

export default defineComponent({
  components: {
    AnimationDialog
  },
  setup (props, { emit }) {
    const store = useStore()
    const setting: SettingType = store.state.setting
    const dialog = ref()
    const state = {
      tabs: ['Html', 'CSS', 'Javascript'],
      activeTab: ref(0),
      headStuff: computed({
        get: () => setting.headStuff,
        set: (val) => store.commit('setting/updateHeadStuff', val)
      }),
      cssPreprocessor: computed({
        get: () => setting.cssPreprocessor,
        set: (val) => store.commit('setting/cssPreprocessor', val)
      }),
      cssCDN: computed({
        get: () => setting.cssCDN,
        set: (val) => store.commit('setting/cssCDN', val)
      }),
      jsCDN: computed({
        get: () => setting.jsCDN,
        set: (val) => store.commit('setting/jsCDN', val)
      })
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
      },
      handleRemoveCssCDN (index) {
        const value = state.cssCDN.value
        if (value.length > 1) {
          value.splice(index, 1)
          store.commit('setting/updateCssCDN', value)
        }
      },
      handleAddCssCDN () {
        const value = state.cssCDN.value
        value.push({
          address: ''
        })
        store.commit('setting/updateCssCDN', value)
      },
      handleRemoveJsCDN (index) {
        const value = state.jsCDN.value
        if (value.length > 1) {
          value.splice(index, 1)
        }
        store.commit('setting/updateJsCDN', value)
      },
      handleAddJsCDN () {
        const value = state.jsCDN.value
        value.push({
          address: ''
        })
        store.commit('setting/updateJsCDN', value)
      },
      handleClose () {
        emit('close')
      }
    }

    return {
      ...state,
      ...methods,
      setting,
      dialog
    }
  }
})
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
      user-select: none;
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
.form-item {
  margin-bottom: 20px;
  .form-content {
    padding: 10px 0;
  }
  .operation-label {
    display: flex;
    align-items: center;
    .label {
      width: 100%;
      flex: 1;
      margin-right: 20px;
    }
  }
  textarea, input, select {
    padding: 5px;
    font-family: 'Courier New', Courier, monospace, "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    background: rgb(209, 209, 209);
    color: #464646;
    border-radius: 4px;
  }
  .input-list-item {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    input {
      width: 100%;
      flex: 1;
      font-size: 16px;
    }
    .delete-btn {
      padding: 0 10px;
      cursor: pointer;
      svg {
        color: rgb(226, 126, 126);
      }
      &:hover {
        svg {
          color: rgb(245, 170, 170);
        }
      }
    }
    .btn-new {
      height: 30px;
      padding: 0 12px;
      font-weight: bold;
      background: #d4d4d8;
    }
  }
  textarea {
    width: 100%;
    resize: none;
  }
  select {
    width: 100%;
    font-weight: bold;
    font-size: 18px;
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
