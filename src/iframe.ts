import { setAttribute } from '@/utils/dom'
import { scss2css } from '@/utils/helper'

function setError (error: string | number) {
  const errorWrapper = document.querySelector('#__errorWrapper__') as HTMLElement;
  const errorText = document.querySelector('#__errorWrapper__ .content') as HTMLElement;
  if (error === -1) {
    errorWrapper.style.display = 'none'
    errorText.innerText = ''
  } else {
    errorWrapper.style.display = 'block'
    errorText.innerText = error as string
  }
}

function loadCDNCSS (url: string) {
  return new Promise((resolve, reject) => {
    const _link = document.createElement('link')
    setAttribute(_link, {
      ref: 'stylesheet',
      href: url
    })
    document.querySelector('head')?.appendChild(_link)
    _link.onload = () => {
      resolve(1)
    }
    _link.onerror = (e) => {
      reject(e)
    }
  })
}

function loadCDNJS (url: string) {
  return new Promise((resolve, reject) => {
    const _script = document.createElement('script')
    setAttribute(_script, {
      type: 'text/javascript',
      src: url
    })
    document.querySelector('body')?.appendChild(_script)
    _script.onload = () => {
      resolve(1)
    }
    _script.onerror = (e) => {
      reject(e)
    }
  })
}

function appendSetting (headStuff: string, cssCDN, jsCDN) {
  const headHtml = document.querySelector('head')?.innerHTML
  if (document.querySelector('head')) {
    (document.querySelector('head') as HTMLHeadElement).innerHTML = headHtml + headStuff
  }
  const reg = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
  const p: Promise<unknown>[] = []
  cssCDN.filter(item => item.address).map(item => {
    if (reg.test(item.address)) p.push(loadCDNCSS(item.address));
  })
  jsCDN.filter(item => item.address).map(item => {
    if (reg.test(item.address)) p.push(loadCDNJS(item.address));
  })
  return Promise.all(p)
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

let settingFlag = true
window.addEventListener('message', async (event) => {
  const { data } = event
  try {
    const { type, data: codeValue } = data
    if (!codeValue) return
    const { html, css, javascript, setting } = codeValue
    if (type !== 'editorChange') return
    setError(-1)
    if (css.code && css.mode === 'sass') {
      try {
        const { css: output } = await scss2css(css.code)
        css.code = output
      } catch (e) {
        setError(e?.error?.formatted || 'scss error')
      }
    }
    if (settingFlag) {
      const { headStuff, cssCDN, jsCDN } = setting
      appendSetting(headStuff, cssCDN, jsCDN).finally(() => {
        loadPage(html.code, css.code, javascript.code)
      })
      settingFlag = false
    } else {
      loadPage(html.code, css.code, javascript.code)
    }
  } catch (e) {
    console.log(e)
  }
}, false)
