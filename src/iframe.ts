type IAttrs = {
  [key: string]: string;
}

function setAttribute (el: HTMLElement, attrs: IAttrs) {
  Object.keys(attrs).map(key => {
    el.setAttribute(key, attrs[key])
  })
}

function loadScript (code) {
  const _script = document.querySelector('#customJS')
  if (_script) document.body.removeChild(_script)
  const script = document.createElement('script')
  script.id = 'customJS'
  script.innerHTML = code
  document.body.appendChild(script)
}

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

function clearCDN () {
  const els = document.querySelectorAll('[_type="cdn"]')
  els.forEach(el => {
    el.parentNode?.removeChild(el)
  })
}

function appendHeadStuff (headStuff: string) {
  document.querySelectorAll('[_type="headstuff"]').forEach(el => {
    el.parentNode?.removeChild(el)
  })
  const reg = /<[^/].*?>/g
  const result = headStuff.replace(reg, function(val) {
    return val.replace('>', ' _type="headstuff">')
  })
  const headHtml = document.querySelector('head')?.innerHTML
  if (document.querySelector('head')) {
    (document.querySelector('head') as HTMLHeadElement).innerHTML = headHtml + result
  }
}

window.addEventListener('message', (event) => {
  const { data } = event
  try {
    const { type, data: codeValue } = data
    if (!codeValue) return
    const { html, css, javascript, updateSettingFlag, setting } = codeValue

    if (type !== 'editorChange') return

    if (updateSettingFlag) {
      const { cssCDN, jsCDN, headStuff } = setting
      appendHeadStuff(headStuff)
      const reg = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
      clearCDN()
      cssCDN.filter(item => item.address).map(item => {
        if (reg.test(item.address)) loadCDNCSS(item.address)
      })
      jsCDN.filter(item => item.address).map(item => {
        if (reg.test(item.address)) loadCDNJS(item.address)
      })
    }

    const customCSS = document.querySelector('#customCSS')
    if (customCSS) customCSS.innerHTML = css.code
    const customHTML = document.querySelector('#customHTML')
    if (customHTML) customHTML.innerHTML = html.code
    loadScript(javascript.code)
  } catch (e) {
    console.log(e)
  }
}, false)
