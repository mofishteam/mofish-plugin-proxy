import { getChild } from './proxyServer'

const lsofPort = (port) => new Promise(resolve => {
  global.utils.lsof.rawTcpPort(port, (data) => {
    resolve(data)
  })
})

export const portTest = async (ctx) => {
  const query = ctx.request.query
  const result = {}
  if (!global.utils.check(query, [['port', 'string'], ['id', 'string']])) {
    global.utils.response(ctx, 400, null, {
      message: 'Param error, check it and retry.'
    })
  } else {
    result.portInfo = await lsofPort(query.port)
    result.canUse = await global.utils.portIsOccupied(query.port)
    result.currentPid = (await getChild(query.id) || {}).pid
  }
  global.utils.response(ctx, 200, result)
}
