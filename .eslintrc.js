module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    // 'vue/max-attributes-per-line': [
    //   2,
    //   {
    //     'singleline': 5,
    //     'multiline': {
    //       'max': 1,
    //       'allowFirstLine': false
    //     }
    //   }
    // ],
    'vue/max-attributes-per-line': 'off',
    'no-eval': 'off',
    'semi': 'off',
    'space-before-function-paren': 'off',
    "comma-dangle": "off"
  }
}
