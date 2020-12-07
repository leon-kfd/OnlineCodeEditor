import { setAttribute } from '@/utils/dom'

function loadCDNCSS (url: string) {
  const _link = document.createElement('link')
  setAttribute(_link, {
    _type: 'cdn',
    ref: 'stylesheet',
    href: url
  })
  document.querySelector('head')?.appendChild(_link)
}

function loadCDNJS (url: string) {
  const _script = document.createElement('script')
  setAttribute(_script, {
    _type: 'cdn',
    type: 'text/javascript',
    src: url
  })
  document.querySelector('body')?.appendChild(_script)
}

function appendHeadStuff (headStuff: string) {
  const reg = /<[^/].*?>/g
  const result = headStuff.replace(reg, function(val) {
    return val.replace('>', ' _type="headstuff">')
  })
  const headHtml = document.querySelector('head')?.innerHTML
  if (document.querySelector('head')) {
    (document.querySelector('head') as HTMLHeadElement).innerHTML = headHtml + result
  }
}

function cleanHeadStuff () {
  document.querySelectorAll('[_type="headstuff"]').forEach(el => {
    el.parentNode?.removeChild(el)
  })
}

function appendCDN (cssCDN, jsCDN) {
  const reg = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
  cssCDN.filter(item => item.address).map(item => {
    if (reg.test(item.address)) loadCDNCSS(item.address)
  })
  jsCDN.filter(item => item.address).map(item => {
    if (reg.test(item.address)) loadCDNJS(item.address)
  })
}

function cleanCDN () {
  document.querySelectorAll('[_type="cdn"]').forEach(el => {
    el.parentNode?.removeChild(el)
  })
}

function resetSetting (setting) {
  const { cssCDN, jsCDN, headStuff } = setting
  cleanHeadStuff()
  cleanCDN()
  appendHeadStuff(headStuff)
  appendCDN(cssCDN, jsCDN)
}

function loadPage (htmlCode, cssCode, jsCode) {
  const _html = document.querySelector('#customHTML')
  if (_html) document.body.removeChild(_html)
  const html = document.createElement('div')
  html.id = 'customHTML'
  html.innerHTML = htmlCode
  document.body.appendChild(html)

  const _css = document.querySelector('#customCSS')
  if (_css) document.head.removeChild(_css)
  const css = document.createElement('style')
  css.id = 'customCSS'
  css.innerHTML = cssCode
  document.head.appendChild(css)

  const _script = document.querySelector('#customJS')
  if (_script) document.body.removeChild(_script)
  const script = document.createElement('script')
  script.id = 'customJS'
  script.innerHTML = jsCode
  document.body.appendChild(script)
}

window.addEventListener('message', (event) => {
  const { data } = event
  try {
    const { type, data: codeValue } = data
    if (!codeValue) return
    const { html, css, javascript, updateSettingFlag, setting } = codeValue

    if (type !== 'editorChange') return
    if (updateSettingFlag) resetSetting(setting)
    loadPage(html.code, css.code, javascript.code)
  } catch (e) {
    console.log(e)
  }
}, false)
