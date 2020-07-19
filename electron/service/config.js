import register from '../api'
import ipcClientGenerator from '../../ipc/client'

const ipcClientSend = null

const connectCore = async () => {
  return ipcClientSend || await ipcClientGenerator()
}

register('getConfig', async () => {
  const ipc = await connectCore()
  console.log('getConfig', await ipc('operation', {
    type: 'get',
    params: {
      name: 'servers'
    }
  }))
  return ipc('operation', {
    type: 'get',
    params: {
      name: 'servers'
    }
  })
})

register('setConfig', async (data) => {
  const ipc = await connectCore()
  return ipc('operation', {
    type: 'set',
    params: data
  })
})
