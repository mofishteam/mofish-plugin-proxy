import proxy from 'koa-server-http-proxy'

export default async function (ctx, config) {
  console.log(ctx.request.query.abc)
  await proxy(ctx.request.rawUrl, { ...config, pathRewrite: {} })(ctx, () => {
    console.log('next')
  })
}
