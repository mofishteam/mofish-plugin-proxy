const Koa = require('koa')
const process = require('process')
const Proxy = require('koa-server-http-proxy')
const _ = require('lodash')
const Mount = require('koa-mount')
const Static = require('koa-static')
const Router = require('koa-router')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const arrayToObject = (arr) => {
  const result = {}
  for (const item of arr) {
    result[item[0]] = item[1]
  }
  return result
}

process.on('message', (options) => {
  const app = new Koa()

  for (const locationOpt of options.locations.reverse()) {
    const mergedOption = _.merge({}, locationOpt)
    console.log(mergedOption.url)
    switch (mergedOption.type) {
      case 'proxyPass':
        mergedOption.proxyPass.router = arrayToObject(mergedOption.proxyPass.router)
        mergedOption.proxyPass.pathRewrite = arrayToObject(mergedOption.proxyPass.pathRewrite)
        mergedOption.proxyPass.secure = false
        app.use(Proxy(mergedOption.url, mergedOption.proxyPass))
        break
      case 'static':
        const staticApp = new Koa()
        staticApp.use(Static(mergedOption.static.path, mergedOption.static))
        app.use(Mount(mergedOption.url, staticApp))
        break
      case 'mock':
        // const mockApp = new Koa()
        // mockApp.use(async (ctx, next) => {
        //   ctx.body =
        // })
        const mockRouter = new Router()
        mockRouter[mergedOption.mock.method](mergedOption.url, async (ctx, next) => {
          switch (mergedOption.mock.type) {
            case 'json': ctx.body = mergedOption.mock.json; break
          }
          await next()
        })
        // staticApp.use(Static(mergedOption.static.path, mergedOption.static))
        app.use(mockRouter.routes())
        app.use(mockRouter.allowedMethods())
        break
    }
  }

  console.log('serverName: ', options.name)
  app.listen(options.listen, options.name || [])
})
