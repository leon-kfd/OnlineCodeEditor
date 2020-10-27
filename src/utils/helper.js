/* eslint-disable */
/**
 * 速览
 * 函数节流: throttle(fn, wait)
 * 函数防抖: debounce(fn, delay)
 * 类型检测: typeTest(target)
 * 深拷贝: deepClone(obj)
 * 滚动到指定位置: scrollTo(top, duration, selector = window)
 * 加载外部Script：loadScript(url)
 */

/**
* 函数节流
* @param {Function} fn 实际要执行的函数
* @param {Number} wait 执行间隔，单位是毫秒（ms），默认100ms
* @return {Function}  返回一个“节流”函数
*/
export function throttle (fn, wait = 100) {
  let timer = null
  let previous // 上次执行时间
  return function () {
    const context = this
    const args = arguments
    const now = +new Date()
    if (previous && now < previous + wait) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        previous = now
        fn.apply(context, args)
      }, wait)
    } else {
      previous = now
      fn.apply(context, args)
    }
  }
}

/**
* 函数防抖
* @param {Function} fn 实际要执行的函数
* @param {Number} delay 延迟时间，单位是毫秒（ms）
* @return {Function}
*/
export function debounce (fn, delay = 1000) {
  let timer
  return function () {
    var context = this
    var args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

/**
 * 类型检测
 * @param {Any} element 传入需要检测的元素
 * @return {String}
 */
export function typeTest (target) {
  var classType = {}
  'Array Date RegExp Object Error'.split(' ').map(item => {
    classType[`[object ${item}]`] = item.toLowerCase()
  })
  if (target == null) return String(target)
  return typeof target === 'object' ? classType[Object.prototype.toString.call(target)] || 'object' : typeof element
}

/**
 * 深拷贝
 * @param {Object} obj
 * @return {Object}
 */
export function deepClone (obj) {
  var objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepClone(obj[key])
        } else {
          objClone[key] = obj[key]
        }
      }
    }
  }
  return objClone
}

/**
* 滚动到指定位置
* @param {number} top 滚到到指定位置的高度
* @param {number} duration 滚动时长
* @param {object} selector 滚动条不在body上时，需传入当前滚动条所在javascriptDom元素
*/
export function scrollTo (top, duration, selector = window) {
  // 兼容requestionAnimationFrame
  (function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame =
        window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
  }());
  const lastTop = selector === window ? (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop) : selector.scrollTop
  const startTime = new Date()
  let timer
  function scrollAnimate () {
    const time = new Date() - startTime
    selector.scrollTo(0, lastTop + (top - lastTop) * (time / duration))
    timer = window.requestAnimationFrame(scrollAnimate)
    if (time >= duration) {
      selector.scrollTo(0, top)
      window.cancelAnimationFrame(timer)
    }
  }
  window.requestAnimationFrame(scrollAnimate)
}

/**
 * 加载外部Script
 * @param {String} url
 * @return {Promise}
 */
export function loadScriptSync (url) {
  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null
            resolve(1)
          }
        }
      } else {
        script.onload = function () {
          resolve(1)
        }
      }
      script.src = url
      document.getElementsByTagName('head')[0].appendChild(script)
    } catch (e) {
      reject(e)
    }
  })
}
