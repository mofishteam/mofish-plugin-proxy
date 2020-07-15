import { generateServerTableData, generateLocationTableData } from './utils/tableDisplay'

export default async function (connectCore, name, id) {
  const ipc = await connectCore()
  return ipc('operation', {
    type: 'reload',
    params: {
      name,
      id
    }
  }).then(res => {
    console.log('These items has been effected: '.blue)
    switch (name) {
      case 'server': console.log(generateServerTableData([res.data])); break
      case 'core': console.log(generateServerTableData(res.data.allProject)); break
      case 'location': console.log(generateLocationTableData([res.data])); break
    }
  })
}
