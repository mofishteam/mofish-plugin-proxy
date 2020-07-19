import ipcServerGenerator from '../../ipc/server'
import serviceGet from './get'
import serviceSet from './set'
import serviceReload from './reload'
import serviceWrite from './write'
import serviceRead from './read'

export default async function (core) {
  const ipcServer = await ipcServerGenerator()

  ipcServer.on('operation', ({ data, id }) => {
    const reply = (msg) => {
      ipcServer.broadcast(`reply-${id}`, { data: msg })
    }
    console.log('server receive: ', data)
    const dataObj = typeof data === 'string' ? JSON.parse(data || '{}') : data
    const params = dataObj.params
    switch (dataObj.type) {
      case 'get': serviceGet({ params, reply, core }); break
      case 'set': serviceSet({ params, reply, core }); break
      case 'reload': serviceReload({ params, reply, core }); break
      case 'write': serviceWrite({ params, reply, core }); break
      case 'read': serviceRead({ params, reply, core }); break
    }
  })
}
