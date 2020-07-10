import ipcServerGenerator from '../ipc/server'

export default async function (core) {
  const ipcServer = await ipcServerGenerator()

  ipcServer.on('operation', ({ data, id }) => {
    console.log('server receive: ', data)
    ipcServer.broadcast(`reply-${id}`, { data: 'reply: ' + data })
  })
  console.log(core)
}
