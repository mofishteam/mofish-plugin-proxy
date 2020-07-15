export default async function ({ params, reply, core }) {
  const providerList = {
    core: () => ({ instance: core, config: core.config }),
    server: () => core.getServer(params.id),
    location: () => core.getLocation(params.id)
  }
  const provider = providerList[params.name] && providerList[params.name]()
  if (provider) {
    await provider.instance.reload()
    reply({
      type: 'success',
      data: provider.config
    })
  } else {
    reply({
      type: 'error',
      message: `Cannot find ${params.name}`
    })
  }
}
