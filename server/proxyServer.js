import childProcess from 'child_process'
import path from 'path'
const childPath = path.join(__dirname, 'child.js')
const childList = {}

export const addChild = async (options) => {
  console.log(await global.utils.portIsOccupied(options.server.listen), options.server.listen)
  if (options.id) {
    if (!childList[options.id]) {
      if (await global.utils.portIsOccupied(options.server.listen)) {
        childList[options.id] = childProcess.fork(childPath, {
          // execPath: 'babel-node',
          // silent: true
        })
        childList[options.id].send(options.server)
        console.log(`Child is started, pid "${childList[options.id].pid}"`)
        // setTimeout(() => {
        //   console.log(child)
        // }, 1000)
        // child.stdout.on('data', (data) => {
        //   console.log(`stdout: ${data}`)
        // })
        // child.stderr.on('data', (data) => {
        //   console.log(`stderr: ${data}`)
        // })
        childList[options.id].on('close', (data) => {
          console.log(`close:  ${data}`)
        })
      } else {
        console.log(`Port ${options.server.listen} is already in use.`)
      }
    }
  }
}

export const restartChild = (options) => {
  if (options.id && childList[options.id]) {
    closeChild(options.id)
    addChild(options)
  }
}

export const closeChild = (id) => {
  if (id && childList[id]) {
    childList[id].kill()
    delete childList[id]
  }
}
