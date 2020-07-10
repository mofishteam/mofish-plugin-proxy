import ipc from 'node-ipc'

ipc.config.id = 'mofishPluginProxyClient'
ipc.config.retry = 1500
let count = 0

export default () => new Promise(resolve => {
  ipc.connectTo(
    'mofishPluginProxy',
    () => {
      ipc.of.mofishPluginProxy.on(
        'connect',
        () => {
          console.log('## connected to mofishPluginProxy ##', ipc.config.delay)
        }
      )
      ipc.of.mofishPluginProxy.on(
        'disconnect',
        () => {
          console.error('disconnected from mofishPluginProxy')
        }
      )
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
})
