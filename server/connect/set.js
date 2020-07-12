export default async function ({ core, params, reply }) {
  switch (params.name) {
    case 'server': core.mergeServerConfig(params.id, params.change)
      await core.saveConfig()
      break
  }
}
