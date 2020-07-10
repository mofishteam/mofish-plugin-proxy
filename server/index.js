import Core from './core'
import fs from 'fs'
import defaultConfig from './commonUtils/default.json'
import connect from './connect'
import os from 'os'
import path from 'path'
const HOME_DIR = os.homedir()
const DEFAULT_CONFIG_PATH = path.join(HOME_DIR, '.mofish-plugin-proxy/config.json')

const tryMkdir = (dirPath) => new Promise(resolve => {
  fs.stat(dirPath, (err) => {
    if (err) {
      fs.mkdirSync(dirPath)
    }
    resolve()
  })
})

const tryMkdirLoop = async (dirPath) => {
  const splitPath = dirPath.replace(/\/[\s\S]+\.json$/, '').replace(/^\//, '').split('/')
  let tempPath = ''
  for (const pathItem of splitPath) {
    tempPath += '/' + pathItem
    await tryMkdir(tempPath)
  }
}

const start = async (configPath = DEFAULT_CONFIG_PATH) => {
  fs.stat(configPath, async (err, stat) => {
    // 没有config文件或者未初始化
    if (err) {
      await tryMkdirLoop(configPath)
      await new Promise(resolve => {
        fs.writeFile(configPath, JSON.stringify(defaultConfig), (err) => {
          if (err) {
            console.error(err)
          } else {
            resolve()
          }
        })
      })
    }
    // 正式读取配置文件
    const config = require(configPath)
    console.log(config)
    // 启动核心功能
    const core = new Core({ config })
    // 对外暴露Socket提供连接
    connect(core)
  })
}

start()
