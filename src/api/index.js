import md5 from 'md5'
const { ipcRenderer } = window.require('electron')
let requestCount = 0
const store = {}

ipcRenderer.on('message-reply', (evt, args) => {
  console.log('reply', args.id, args.data)
  store[args.id] && store[args.id](args.data)
})

export default function (url, data) {
  const id = md5(new Date().valueOf() + requestCount++)
  return new Promise(resolve => {
    console.log(id, data, url)
    ipcRenderer.send('message', {
      url,
      data,
      id
    })
    store[id] = (res) => {
      resolve(res)
    }
  })
}
