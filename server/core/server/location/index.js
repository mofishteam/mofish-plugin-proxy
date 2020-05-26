import proxyPass from './proxyPass'

export default class Location {
  constructor ({ config = {} }) {
    this.setConfig(config)
  }
  setConfig (config) {
    this.config = config
  }
  // 匹配url，TODO: 后面要做:id这种params识别
  matchUrl (url) {
    const reg = new RegExp('^' + this.config.url)
    return reg.test(url)
  }
  // 处理ctx，如果url匹配，则返回
  async getResponse (ctx) {
    if (this.matchUrl(ctx.request.rawUrl)) {
      switch (this.config.type) {
        case 'proxyPass': await proxyPass(ctx, this.config.proxyPass); break
        default: return false
      }
      return true
    }
  }
}
