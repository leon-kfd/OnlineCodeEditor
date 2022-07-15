export function setWidth(el: string | HTMLElement, width: string) {
  const targetEl = typeof el === 'string' ? document.querySelector(el) as HTMLElement : el
  if (targetEl) targetEl.style.width = width
}
export function setHeight(el: string | HTMLElement, height: string) {
  const targetEl = typeof el === 'string' ? document.querySelector(el) as HTMLElement : el
  if (targetEl) targetEl.style.height = height
}
export function getHeight(el: string | HTMLElement) {
  const targetEl = typeof el === 'string' ? document.querySelector(el) as HTMLElement : el
  if (targetEl) {
    const height = window.getComputedStyle(targetEl).height
    return +height.replace('px', '')
  } else {
    return 0
  }
}

export function setAttribute(el: HTMLElement, attrs: { [key: string]: string }) {
  Object.keys(attrs).map(key => {
    el.setAttribute(key, attrs[key])
  })
}
