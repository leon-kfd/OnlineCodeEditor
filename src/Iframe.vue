<template>
  <template v-html="dangerHtml"></template>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {
  setup () {
    const dangerHtml = ref('')
    window.addEventListener('message', (event) => {
      const { data } = event
      try {
        const { type, data: codeValue } = data
        if (type !== 'editorChange') return
        const { html, css, javascript } = codeValue
        dangerHtml.value = `
          <style>${css.code}</style>
          ${html.code}
          <script>${javascript.code}</script` + '>'
        eval(javascript.code)
      } catch (e) {
        console.log(e)
      }
    }, false)
    return {
      dangerHtml
    }
  }
}
</script>

<style lang="scss">
</style>
