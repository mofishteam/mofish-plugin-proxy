import k2c from 'koa2-connect'
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
  constructor ({ config = {}, serverConfig = {}, id }) {
    this.id = id
    this.serverConfig = serverConfig
    this.setConfig(config)
    this.init()
  }
  setConfig (config) {
    this.config = config
    this.method = (this.config[this.config.type].method || 'all').toLowerCase()
  }
  init () {
    // this.router[this.method](this.routerUrl, async (ctx, next) => {
    //   // 设置Interceptor
    //   if (this.config.interceptors) {
    //     for (const interceptor of this.config.interceptors) {
    //       await (new Function('ctx', interceptor))(ctx)
    //     }
    //   }
    //   await next()
    // })
    // 根据不同type添加不同的router
    this.setResponse()
    // 使用use方法挂载到根路由，在销毁时通过this.rootRouter.stack实现解挂
    // this.rootRouter.use(`/port-${this.serverConfig.server.listen}`, this.router.routes(), this.router.allowedMethods())
  }
  async action (ctx, next) {
    await this.resHandler(ctx, next)
  }
  setResHandler (middleware) {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
    this.resHandler = async (ctx, next) => {
      if (this.config.interceptors) {
        for (const interceptor of this.config.interceptors) {
          if (interceptor.stage === 'before') {
            await (new AsyncFunction('ctx', interceptor.handler))(ctx)
          }
        }
      }
      await middleware(ctx, next)
      if (this.config.interceptors) {
        for (const interceptor of this.config.interceptors) {
          if (interceptor.stage === 'after') {
            await (new AsyncFunction('ctx', interceptor.handler))(ctx)
          }
        }
      }
    }
  }
  // 使用proxyPass
  useProxyPass () {
    // 把config中用户填写的method都改为小写
    // router方法第一个参数强制给url添加/(.*)来实现通配（含 / 与否都可匹配）
    // createProxyMiddleware接受参数与httpProxy库基本相同（应该就是一个封装），使用k2c将这个express中间件转换为koa中间件
    // TODO: interceptor，timeout的实现
    this.setResHandler(k2c(createProxyMiddleware({
      ...this.config.proxyPass,
      pathRewrite: arrayToObject(this.config.proxyPass.pathRewrite)
    })))
  }
  // 使用StaticServer
  useStatic () {
    this.setResHandler(Static(this.config.static.path, this.config.static))
  }
  // 使用mockServer
  useMock () {
    this.setResHandler(async (ctx, next) => {
      ctx.body = this.config.mock.body
      // 设置Headers
      if (this.config.mock.header) {
        ctx.set(this.config.mock.header)
      }
      // 设置Status
      if (!this.config.mock.status || this.config.mock.status !== 200) {
        ctx.status = this.config.mock.status
      }
      await next()
    })
  }
  setResponse () {
    switch (this.config.type) {
      case 'proxyPass': this.useProxyPass(); break
      case 'static': this.useStatic(); break
      case 'mock': this.useMock(); break
      default: return false
    }
  }
  // TODO: 从 this.rootRouter.stack 中去除 this.router 中的路由
  destroy () {}
}
