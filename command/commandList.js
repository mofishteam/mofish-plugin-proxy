import Table from 'cli-table'

// 强制显示表格框，不强制白色会显示不出表格框
const formatTable = (tableString) => {
  const tableBorder = ['┌', '┬', '┐', '├', '┼', '┤', '└', '┴', '┘', '│', '─']
  return tableString.split('').map(char => {
    if (tableBorder.includes(char)) {
      return char.white
    } else {
      return char
    }
  }).join('')
}

const generateServerTableData = (data) => {
  const table = new Table({
    head: ['id'.blue, 'type'.blue, 'name'.blue, 'locations'.blue]
  })
  console.log(data)
  table.push(...data.map(item => [item.id.slice(0, 6), item.type, item.name, `Has ${item.server.locations.length} Locations`]))
  return formatTable(table.toString())
}

const generateLocationTableData = (data) => {
  const table = new Table({
    head: ['id'.blue, 'type'.blue, 'url'.blue, 'method'.blue, 'interceptors'.blue, 'isRunning'.blue]
  })
  console.log(data)
  table.push(...data.map(item => [item.id.slice(0, 6), item.type, item.url, item.method, `Has ${item.interceptors.length} Interceptors`, !item.isClose ? 'TRUE'.green : 'FALSE'.red]))
  return formatTable(table.toString())
}

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
