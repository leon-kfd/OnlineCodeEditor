// import { createApp } from 'vue'
// import App from './Iframe.vue'
// createApp(App).mount('#app')
function loadScript (code) {
  const _script = document.querySelector('#customJS')
  if (_script) document.body.removeChild(_script)
  const script = document.createElement('script')
  script.id = 'customJS'
  script.innerHTML = code
  document.body.appendChild(script)
}
window.addEventListener('message', (event) => {
  const { data } = event
  try {
    const { type, data: codeValue } = data
    if (type !== 'editorChange') return
    const { html, css, javascript } = codeValue
    const customCSS = document.querySelector('#customCSS')
    if (customCSS) customCSS.innerHTML = css.code
    const customHTML = document.querySelector('#customHTML')
    if (customHTML) customHTML.innerHTML = html.code
    loadScript(javascript.code)
  } catch (e) {
    console.log(e)
  }
}, false)
