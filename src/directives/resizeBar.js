import ResizeBar from '@/components/resizeBar'

export default {
  install (Vue) {
    const componentMap = new Map()
    Vue.directive('resizeable', {
      bind (el, { modifiers, value }, vnode, oldVnode) {
        const Constructor = Vue.extend(ResizeBar)
        const resizeBarInterface = new Constructor({
          data: {
            position: 'right',
            target: el
          }
        })
        resizeBarInterface.$mount()
        document.body.appendChild(resizeBarInterface.$el)
        componentMap.set(el, [resizeBarInterface])
      }
    })
  }
}
