/* eslint-disable */
export async function scss2css (scss) {
  try {
    const res = await fetch('https://api.sassmeister.com/compile', {
      method: 'POST',
      body: JSON.stringify({
        input: scss,
        outputStyle: 'expanded',
        syntax: 'SCSS',
        compiler: 'dart-sass/1.26.11'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (res.status === 200) {
      return await res.json()
    } else {
      const json = await res.json()
      return Promise.reject(json)
    }
  } catch (e) {
    return Promise.reject(e)
  }
}

export function debounce (fn, delay = 1000) {
  let timer
  return function (this:any) {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}