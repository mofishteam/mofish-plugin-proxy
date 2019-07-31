const Koa = require('koa')
const process = require('process')

process.on('message', (options) => {
  const app = new Koa()

  app.listen(options.server.listen)
})
