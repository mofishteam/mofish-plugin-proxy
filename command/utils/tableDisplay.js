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

export const generateServerTableData = (data) => {
  const table = new Table({
    head: ['id'.blue, 'type'.blue, 'name'.blue, 'locations'.blue]
  })
  table.push(...data.map(item => [item.id.slice(0, 6), item.type, item.name, `Has ${item.server.locations.length} Locations`]))
  return formatTable(table.toString())
}

export const generateLocationTableData = (data) => {
  const table = new Table({
    head: ['id'.blue, 'type'.blue, 'url'.blue, 'method'.blue, 'interceptors'.blue, 'isRunning'.blue]
  })
  console.log(data)
  table.push(...data.map(item => [item.id.slice(0, 6), item.type, item.url, item.method, `Has ${item.interceptors.length} Interceptors`, !item.isClose ? 'TRUE'.green : 'FALSE'.red]))
  return formatTable(table.toString())
}
