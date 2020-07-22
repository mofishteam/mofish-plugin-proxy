import Core from './core'
import fs from 'fs'
import defaultConfig from './commonUtils/default.json'
import connect from './connect'
import 'colors'
import os from 'os'
import path from 'path'
import { writeFile } from './utils/writeFile'
const HOME_DIR = os.homedir()
const DEFAULT_CONFIG_PATH = path.join(HOME_DIR, '.mofish-plugin-proxy/config.json')

const start = async (configPath = DEFAULT_CONFIG_PATH) => {
  fs.stat(configPath, async (err, stat) => {
    // 没有config文件或者未初始化
    if (err) {
      console.log(err)
      await writeFile(configPath, JSON.stringify(defaultConfig))
    }
    // 正式读取配置文件
    const config = JSON.parse(fs.readFileSync(configPath).toString())
    // 启动核心功能
    const core = new Core({ config, configPath, utils: { writeFile } })
    // 对外暴露Socket提供连接
    await connect(core)
  })
}

start()
