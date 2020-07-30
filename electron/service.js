import register from './api'
import ipcClientGenerator from '../ipc/client'

let ipcClientSend = null

const connectCore = async () => {
  return ipcClientSend || (ipcClientSend = await ipcClientGenerator())
}

register('raw', async (data) => {
  const ipc = await connectCore()
  console.log('raw', data)
  return ipc('operation', data)
})
