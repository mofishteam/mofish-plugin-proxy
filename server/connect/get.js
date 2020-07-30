export default function ({ core, params, reply }) {
  let result = null
  let cantFindErrorDefault = { type: 'error', message: `Can't find ${params.name}${params.id ? ' of id ' + '"' + params.id + '"' : ''}` }
  const wrapResult = (data) => {
    console.log('wrapResult', data)
    if (data) {
      return { type: 'success', data }
    } else {
      return cantFindErrorDefault
    }
  }
  switch (params.name) {
    case 'server': result = wrapResult((core.getServer(params.id) || {}).config); break
    case 'servers': result = wrapResult(core.getServerConfigList()); break
    case 'location': result = wrapResult((core.getLocation(params.id) || {}).config); break
    case 'locations': result = wrapResult(core.getLocationConfigList()); break
    default: result = cantFindErrorDefault
  }
  reply(result)
}
