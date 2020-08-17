import { getId } from '../commonUtils/options'

export default async function ({ core, params, reply }) {
  const id = params.id || (params.change && params.change.id) || getId(`server-${params.change.type}`)
  switch (params.name) {
    case 'server': core.mergeServerConfig(id, params.change)
      await core.saveConfig()
      console.log(params, core.getServer(id), 'id: ', id)
      if (core.getServer(id)) {
        reply({ type: 'success', data: core.getServer(id).config })
      } else {
        reply({ type: 'error', message: `Cannot find Server of id ${id}.` })
      }
      break
    case 'location': core.mergeLocationConfig(id, params.change)
      await core.saveConfig()
      reply({ type: 'success', data: core.getLocation(id).config })
      break
  }
}
