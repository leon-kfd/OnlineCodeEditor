import { SettingType } from '@/components/Setting'

export default {
  namespaced: true,
  state: {
    headStuff: '',
    cssPreprocessor: 'css',
    cssCDN: [{ address: '' }],
    jsCDN: [{ address: '' }]
  } as SettingType,
  mutations: {
    updateHeadStuff(state, headStuff) {
      state.headStuff = headStuff
    },
    updateCssPreprocessor(state, cssPreprocessor) {
      state.cssPreprocessor = cssPreprocessor
    },
    updateCssCDN(state, cssCDN) {
      state.cssCDN = cssCDN
    },
    updateJsCDN(state, jsCDN) {
      state.jsCDN = jsCDN
    }
  },
  actions: {
  },
  modules: {
  }
}
