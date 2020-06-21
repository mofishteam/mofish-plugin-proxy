import proxyPass from './proxyPass'
import k2c from 'koa2-connect'
import Router from 'koa-router'
import { createProxyMiddleware } from 'http-proxy-middleware'

const arrayToObject = (arr) => {
  const result = {}
  for (const item of arr) {
    result[item[0]] = item[1]
  }
  return result
}

export default class Location {
  constructor ({ config = {}, serverConfig = {}, router }) {
    this.rootRouter = router
    this.serverConfig = serverConfig
    this.setConfig(config)
    this.init()
  }
  setConfig (config) {
    this.config = config
  }
  init () {
    this.router = new Router()
    const method = (this.config[this.config.type].method || 'all').toLowerCase()
    console.log('this.router.get', `/port-${this.serverConfig.server.listen}${this.config.url}`, method)
    // // fixme: 这里会给一个奇怪的404，待排查
    // this.router[method](`/port-${this.serverConfig.server.listen}`, async (ctx, next) => {
    //   console.log(ctx.status, ctx.request)
    //   ctx.request.url = ctx.request.rawUrl
    //   await this.getResponse(ctx, next)
    //   console.log('ctx.url', ctx.url)
    //   console.log(ctx.status, ctx.request)
    //   await next()
    // })
    // fixme: 卡在不能一个 / 全匹配根目录，目前考虑config中输入 / ，然后router的url转为正则
    this.router.all('/*', 'abc', async (ctx, next) => {
      ctx.request.url = ctx.request.rawUrl
      await next()
    })
    this.router.get('/*/*', 'bcd', k2c(createProxyMiddleware({
      ...this.config.proxyPass,
      pathRewrite: arrayToObject(this.config.proxyPass.pathRewrite)
    })))
    // this.router.all('/404.html', async (ctx, next) => {
    //   console.log(ctx.request.url)
    //   // await next()
    // })
    this.rootRouter.use(`/port-${this.serverConfig.server.listen}`, this.router.routes(), this.router.allowedMethods())
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
          // 生成一个proxy函数
          const proxy = createProxyMiddleware({
            ...this.config.proxyPass,
            pathRewrite: arrayToObject(this.config.proxyPass.pathRewrite)
          })
          await proxyPass(ctx, this.config.proxyPass, proxy)
        } break
        default: return false
      }
      return true
    }
  }
  destroy () {}
}
