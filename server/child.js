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

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
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
        const fn = (body) => {
          return new Buffer('<html><body><div>123</div></body></html>')
          // return body
        }
        proxyOptions.onProxyRes = (proxyRes, req, res) => {
          // let body = new Buffer('')
          // proxyRes.on('data', function (data) {
          //   body = Buffer.concat([body, data])
          // })
          // proxyRes.on('end', function () {
          //   // body = body.toString()
          //   // console.log("res from proxied server:", body)
          //   res.end('body')
          // })
          const oriWriteHead = res.writeHead
          const oriWrite = res.write
          const oriEnd = res.end
          let jsonString = new Buffer('')
          Object.assign(res, {
            writeHead: () => {
            },
            write: (chunk) => {
              jsonString = Buffer.concat([jsonString, chunk])
            },
            end: () => {
              const handledRes = fn(jsonString)
              console.log('handledRes: ', handledRes)
              // const buffer = new Buffer(handledRes) // 一定要转成buffer，buffer长度和string长度不一样
              const headers = Object.keys(proxyRes.headers)
                .reduce((prev, key) => {
                  const value = key === 'content-length' ? handledRes.length : proxyRes.headers[key]
                  return Object.assign({}, prev, {[key]: value})
                }, {});
              delete headers['content-encoding']
              console.log(headers)
              console.log(proxyRes.statusCode)
              oriWriteHead.apply(res, [proxyRes.statusCode, headers])
              oriWrite.call(res, handledRes)
              oriEnd.call(res)
            }
          })
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
