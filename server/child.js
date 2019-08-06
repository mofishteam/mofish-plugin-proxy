const Koa = require('koa')
const process = require('process')
const Proxy = require('http-proxy-middleware')
const _ = require('lodash')
const Mount = require('koa-mount')
const Static = require('koa-static')
const Router = require('koa-router')
const http = require('http')
const https = require('https')
const Connect = require('koa2-connect')
// const KoaSSL = require('koa-sslify').default
const fs = require('fs')

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

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
    switch (mergedOption.type) {
      case 'proxyPass':
        mergedOption.proxyPass.router = arrayToObject(mergedOption.proxyPass.router)
        mergedOption.proxyPass.pathRewrite = arrayToObject(mergedOption.proxyPass.pathRewrite)
        mergedOption.proxyPass.secure = false
        // mergedOption.proxyPass.selfHandleResponse = true
        // app.use(async (ctx, next) => {
        //   if (mergedOption.proxyPass.interceptors && mergedOption.proxyPass.interceptors.request) {
        //     for (const req of mergedOption.proxyPass.interceptors.request || []) {
        //       await (new AsyncFunction('ctx', req.handler))(ctx)
        //     }
        //   }
        //
        //   if (mergedOption.proxyPass.interceptors && mergedOption.proxyPass.interceptors.response) {
        //     for (const res of mergedOption.proxyPass.interceptors.response || []) {
        //       await (new AsyncFunction('ctx', res.handler))(ctx)
        //     }
        //   }
        //   // cawait next()tx.body = []
        // })
        const proxyOptions = _.merge({}, mergedOption.proxyPass)
        proxyOptions.onProxyRes = (proxyRes, req, res) => {
          console.log(proxyRes.headers, res.writeHead.toString())
          res.writeHead(200, proxyRes.headers)
          res.write('11122')
          // res.statusMessage = proxyRes.statusMessage
          const cache = []
          // res.write()
          res.end('123')
        }
        const proxy = Proxy(mergedOption.url, proxyOptions)
        // proxy.on('proxyRes', (proxyRes, req, res) => {
        //   console.log(proxyRes, req, res)
        // })
        app.use(Connect(proxy))
        // app.use(async (ctx, next) => {
        //   await Proxy(mergedOption.url, mergedOption.proxyPass)(ctx, next)
        // })
        // app.use(async (ctx, next) => {
        //   console.log(ctx.body)
        //   next()
        // })
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
  if (options.ssl && options.sslOptions) {
    let key = ''
    let cert = ''
    try {
      key = fs.readFileSync(options.sslOptions.key).toString()
      cert = fs.readFileSync(options.sslOptions.cert).toString()
    } catch (err) {
      console.log(`Error when reading cert files, Error: \n${err}\n=====================`)
    }
    // app.use(KoaSSL())
    if (key && cert) {
      https.createServer({
        key, cert
      }, app.callback()).listen(options.listen, options.name[0])
    } else {
      console.error('Cert Error, please check your cert and key path.')
    }
  } else {
    http.createServer(app.callback()).listen(options.listen, options.name[0])
  }
  // app.listen(options.listen, options.name[0])
})
