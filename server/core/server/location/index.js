import proxyPass from './proxyPass'
import Proxy from 'http-proxy'

export default class Location {
  constructor ({ config = {}, router }) {
    this.router = router
    this.setConfig(config)
    this.init()
  }
  setConfig (config) {
    this.config = config
  }
  init () {}
  // 匹配url，TODO: 后面要做:id这种params识别
  matchUrl (url) {
    const reg = new RegExp('^' + this.config.url)
    return reg.test(url)
  }
  // 处理ctx，如果url匹配，则返回
  async getResponse (ctx) {
    console.log(this.config.type, ctx.request.rawUrl)
    if (this.matchUrl(ctx.request.rawUrl)) {
      switch (this.config.type) {
        case 'proxyPass': {
          const proxy = Proxy.createProxyServer(this.config.proxyPass)
          await proxyPass(ctx, this.config.proxyPass, proxy)
        } break
        default: return false
      }
      return true
    }
  }
  destroy () {}
}
