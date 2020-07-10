const ipc = require('node-ipc')

ipc.config.id = 'mofishPluginProxy'
ipc.config.retry = 1500

const generator = () => new Promise(resolve => {
  ipc.serve(() => {
    ipc.server.on(
      'socket.disconnected',
      (socket, destroyedSocketID) => {
        ipc.log('client ' + destroyedSocketID + ' has disconnected!')
      }
    )
    resolve(ipc.server)
  })

  ipc.server.start()
})

module.exports = generator
