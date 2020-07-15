import { generateServerTableData, generateLocationTableData } from './utils/tableDisplay'

export default async function (connectCore, type, typeId) {
  const ipc = await connectCore()
  const serverList = (await ipc('operation', { type: 'get', params: { name: 'servers' } })).data
  const locationList = (await ipc('operation', { type: 'get', params: { name: 'locations' } })).data
  console.log('serverList: ', serverList.filter, typeId)
  switch (type) {
    case 'server': if (typeId) {
      console.log(generateServerTableData(serverList.filter(item => item.id === typeId)))
    } else {
      console.log(generateServerTableData(serverList))
    } break
    case 'location': if (typeId && serverList.find(item => item.id === typeId)) {
      console.log(generateLocationTableData(serverList.find(item => item.id === typeId).server.locations))
    } else {
      console.log(generateLocationTableData(locationList))
    }
  }
}
