const ipcClientGenerator = require('../ipc/client').default;

(async () => {
  const ipcClientSend = await ipcClientGenerator()

  setTimeout(() => {
    ipcClientSend('operation', 'test client').then(res => {
      console.log('client receive: ', res)
    })
  }, 500)
})()
