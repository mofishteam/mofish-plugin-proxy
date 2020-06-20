import proxyPass from './proxyPass'
import Proxy from 'http-proxy'

export default class Location {
  constructor ({ config = {}, serverConfig = {}, router }) {
    this.router = router
    this.serverConfig = serverConfig
    this.setConfig(config)
    this.init()
  }
  setConfig (config) {
    this.config = config
  }
  init () {
    const method = (this.config[this.config.type].method || 'all').toLowerCase()
    console.log('this.router.get', `/port-${this.serverConfig.server.listen}${this.config.url}`, method)
    // fixme: 这里会给一个奇怪的404，待排查
    this.router[method](`/port-${this.serverConfig.server.listen}`, async (ctx, next) => {
      console.log(ctx.status)
      await this.getResponse(ctx, next)
      console.log(ctx.status)
    })
  }
  // 匹配url，TODO: 后面要做:id这种params识别
  matchUrl (url) {
    const reg = new RegExp('^' + this.config.url)
    return reg.test(url)
  }
  // 处理ctx，如果url匹配，则返回
  async getResponse (ctx, next) {
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
    await next()
  }
  destroy () {}
}
