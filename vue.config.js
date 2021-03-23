const isProduction = process.env.NODE_ENV === 'production'
const assetsCDN = {
  externals: {
    // codemirror: 'CodeMirror'
  },
  css: [
    'https://cdn.bootcdn.net/ajax/libs/codemirror/5.58.1/codemirror.min.css',
    'https://cdn.bootcdn.net/ajax/libs/codemirror/5.58.1/theme/material-darker.min.css'
  ],
  js: [
    // 'https://cdn.bootcdn.net/ajax/libs/codemirror/5.58.1/codemirror.min.js',
    // 'https://cdn.bootcdn.net/ajax/libs/codemirror/5.58.1/mode/htmlmixed/htmlmixed.min.js',
    // 'https://cdn.bootcdn.net/ajax/libs/codemirror/5.58.1/mode/javascript/javascript.min.js',
    // 'https://cdn.bootcdn.net/ajax/libs/codemirror/5.58.1/mode/css/css.min.js',
    // 'https://cdn.bootcdn.net/ajax/libs/codemirror/5.58.1/mode/sass/sass.min.js'
  ]
}

const isHashMode = process.env.VUE_APP_ROUTER_MODE === 'hash'
const publicPath = isHashMode ? './' : '/coder'

module.exports = {
  pages: {
    index: 'src/main.ts',
    iframe: 'src/iframe.ts'
  },
  configureWebpack: {
    // externals: isProduction ? assetsCDN.externals : {}
    externals: assetsCDN.externals
  },
  chainWebpack: config => {
    config.plugin('html-index').tap(args => {
      args[0].cdn = assetsCDN
      return args
    })
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/assets/variable.scss";'
      }
    }
  },
  productionSourceMap: !isProduction,
  publicPath
}
