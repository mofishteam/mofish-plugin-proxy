export default function (ctx, config, proxy) {
  return new Promise(resolve => {
    // console.log(ctx.res)
    proxy.web(ctx.req, ctx.res)
    proxy.on('proxyRes', (proxyRes, req, res) => {
      console.log('proxyRes', proxyRes)
      resolve()
    })
    // console.log('res:', ctx.response)
    // await proxy(ctx.request.rawUrl, { ...config, pathRewrite: {} })(ctx, () => {
    //   console.log('next')
    // })
  })
}
