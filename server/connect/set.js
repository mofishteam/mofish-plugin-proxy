export default async function ({ core, params, reply }) {
  switch (params.name) {
    case 'server': core.mergeServerConfig(params.id || (params.change && params.change.id), params.change)
      await core.saveConfig()
      console.log(params, core.getServer(params.id))
      reply({ type: 'success', data: core.getServer(params.id).config })
      break
    case 'location': core.mergeLocationConfig(params.id, params.change)
      await core.saveConfig()
      reply({ type: 'success', data: core.getLocation(params.id).config })
      break
  }
}
