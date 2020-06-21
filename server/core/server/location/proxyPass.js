export default function (ctx, config, proxy) {
  return new Promise(resolve => {
    console.log('proxyUrl: ', ctx.url)
    // console.log(Object.keys(ctx))
    // console.log(ctx.request)
    // console.log('=====')
    // console.log(ctx.req)
    proxy(ctx, () => {
      resolve()
    })
    // proxy.web(ctx.req, ctx.res, config)
    // proxy.on('proxyRes', (proxyRes, req, res) => {
    //   // console.log('proxyRes: ', ctx.res)
    //   console.log(ctx.req === req)
    //   resolve()
    // })
    // console.log('res:', ctx.response)
    // await proxy(ctx.request.rawUrl, { ...config, pathRewrite: {} })(ctx, () => {
    //   console.log('next')
    // })
  })
}
