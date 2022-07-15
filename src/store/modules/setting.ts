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
    updateHeadStuff(state: any, headStuff: string) {
      state.headStuff = headStuff
    },
    updateCssPreprocessor(state: any, cssPreprocessor: string) {
      state.cssPreprocessor = cssPreprocessor
    },
    updateCssCDN(state: any, cssCDN: any[]) {
      state.cssCDN = cssCDN
    },
    updateJsCDN(state: any, jsCDN: any[]) {
      state.jsCDN = jsCDN
    }
  },
  actions: {
  },
  modules: {
  }
}
