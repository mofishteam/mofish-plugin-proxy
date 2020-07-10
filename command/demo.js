import commandInputHandler from './index'
// import '../ipc/client'
// import path from 'path'

(async () => {
  commandInputHandler({
    config: require('./demoConfig.json')
  })
})()
