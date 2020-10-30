import { createStore } from 'vuex'
import { SettingType } from '@/components/Setting'

const setting: SettingType = {
  headStuff: '',
  cssPreprocessor: 'css',
  cssCDN: [{ address: '' }],
  jsCDN: [{ address: '' }]
}

export default createStore({
  state: {
    setting
  },
  mutations: {
    updateSetting (state, payload) {
      state.setting = { ...state.setting, ...payload }
      console.log(state.setting)
    }
  },
  actions: {
  },
  modules: {
  }
})
