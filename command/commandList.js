export default async function (connectCore, type, typeId) {
  const ipc = await connectCore()
  const serverList = await ipc('operation', { type: 'get', params: { name: 'servers' } })
  console.log(serverList)
  switch (type) {}
}
