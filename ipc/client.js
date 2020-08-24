import ipc from 'node-ipc'

ipc.config.id = 'mofishPluginProxyClient'
ipc.config.retry = 1500
ipc.config.silent = true
let count = 0

export default (options = { exitWhenDisconnected: true }) => new Promise(resolve => {
  console.log(ipc)
  const { exitWhenDisconnected = true } = options
  ipc.connectTo(
    'mofishPluginProxy',
    () => {
      ipc.of.mofishPluginProxy.on(
        'connect',
        () => {
          console.log('## connected to mofishPluginProxy ##', ipc.config.delay)
          resolve((type, message) => new Promise(resolve => {
            const id = `${count}-${new Date().valueOf()}`
            ipc.of.mofishPluginProxy.emit(type, {
              id,
              data: message
            })
            ipc.of.mofishPluginProxy.on(`reply-${id}`, ({ data }) => {
              resolve(data)
            })
          }))
        }
      )
      ipc.of.mofishPluginProxy.on(
        'disconnect',
        () => {
          console.error('disconnected from mofishPluginProxy')
          if (exitWhenDisconnected) {
            process.exit()
          }
        }
      )
    }
  )
})
