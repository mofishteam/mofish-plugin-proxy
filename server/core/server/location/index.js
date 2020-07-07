import k2c from 'koa2-connect'
import Router from 'koa-router'
import Static from 'koa-static'
import { createProxyMiddleware } from 'http-proxy-middleware'

// array转换为object，item[0]作为key，item[1]作为value
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
    this.method = (this.config[this.config.type].method || 'all').toLowerCase()
    this.routerUrl = `${this.config.url.replace(/\(\.\*\)$/, '').replace(/\/$/, '')}/(.*)`
  }
  init () {
    this.router = new Router()
    // 进入Location规则之后把url改回标准形式（去除/port-xxxx）
    this.router.all('/*', async (ctx, next) => {
      // rawUrl：在core中定义为最原始的进入路由的url，在后面ctx.request.url被处理，加上了/port-xxxx
      ctx.request.url = ctx.request.rawUrl
      await next()
    })
    // 根据不同type添加不同的router
    this.setResponse()
    // 使用use方法挂载到根路由，在销毁时通过this.rootRouter.stack实现解挂
    this.rootRouter.use(`/port-${this.serverConfig.server.listen}`, this.router.routes(), this.router.allowedMethods())
  }
  // 使用proxyPass
  useProxyPass (router) {
    // 把config中用户填写的method都改为小写
    // router方法第一个参数强制给url添加/(.*)来实现通配（含 / 与否都可匹配）
    // createProxyMiddleware接受参数与httpProxy库基本相同（应该就是一个封装），使用k2c将这个express中间件转换为koa中间件
    // TODO: interceptor，timeout的实现
    router[this.method](this.routerUrl, k2c(createProxyMiddleware({
      ...this.config.proxyPass,
      pathRewrite: arrayToObject(this.config.proxyPass.pathRewrite)
    })))
  }
  // 使用StaticServer
  useStatic (router) {
    router[this.method](this.routerUrl, Static(this.config.static.path, this.config.static))
  }
  // 使用mockServer
  useMock (router) {
    router[this.method](this.routerUrl, async (ctx, next) => {
      ctx.body = this.config.mock.body
      // 设置Headers
      if (this.config.mock.header) {
        ctx.set(this.config.mock.header)
      }
      // 设置Status
      if (!this.config.mock.status || this.config.mock.status !== 200) {
        ctx.status = this.config.mock.status
      }
      // 设置Interceptor
      if (this.config.mock.interceptor) {
        (new Function('ctx', this.config.mock.interceptor))(ctx)
      }
      // await next()
    })
  }
  setResponse () {
    switch (this.config.type) {
      case 'proxyPass': this.useProxyPass(this.router); break
      case 'static': this.useStatic(this.router); break
      case 'mock': this.useMock(this.router); break
      default: return false
    }
  }
  // TODO: 从 this.rootRouter.stack 中去除 this.router 中的路由
  destroy () {}
}
