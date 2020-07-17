import { ipcMain } from 'electron'

const store = {}

ipcMain.on('message', async (evt, arg) => {
  if (store[arg.url]) {
    const replyData = await store[arg.url](arg.data)
    evt.reply('message-reply', {
      url: arg.url,
      id: arg.id,
      data: replyData
    })
  }
})

export default function register (url, handler) {
  store[url] = handler
}
