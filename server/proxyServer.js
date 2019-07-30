import childProcess from 'child_process'
import path from 'path'
const childPath = path.join(__dirname, 'child.js')
const childList = {}

export const addChild = (options) => {
  if (options.id) {
    if (!childList[options.id]) {
      // const child = childProcess.execFile(childPath)
      // child.stdout.on('data', (data) => {
      //   console.log(`stdout: ${data}`)
      // })
      // child.stderr.on('data', (data) => {
      //   console.log(`stderr: ${data}`)
      // })
      // child.on('close', (data) => {
      //   console.log(`close: ${data}`)
      // })
    }
  }
}
