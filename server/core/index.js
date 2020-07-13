import merge from 'lodash.merge'
import Koa from 'koa'
import Server from './server/index'
import { defaultServerOption, getId } from '../commonUtils/options'
import urlParser from 'url-parse'
import fs from 'fs'
// import cloneDeep from 'lodash.clonedeep'

// 核心类，用来收集Server和下发配置
export default class Core {
  constructor ({ config = {}, configPath }) {
    this.config = {}
    this.configPath = configPath
    this.setConfig(config)
  }
  /*
  * 设置Config
  * @param config 配置JSON
  * @param silence 是否触发重载
  * */
  setConfig (config, silence = false) {
    // this.rawConfig = cloneDeep(this.config)
    this.config = merge(this.config, config)
    this.serversConfig = this.config.allProject
    if (!silence) {
      this.reload()
    }
  }
  // 将config保存到文件
  saveConfig () {
    return new Promise(resolve => {
      fs.writeFile(this.configPath, JSON.stringify(this.config), (err) => {
        if (err) {
          console.error(err)
        } else {
          resolve()
        }
      })
    })
  }
  // 获取合并后的config
  getMergedConfig () {
    return this.config
  }
  // 获取合并前的config
  // getRawConfig () {
  //   return this.rawConfig
  // }
  // 合并某个server的配置
  mergeServerConfig (id, data) {
    const serverResult = this.getServer(id)
    const serverConfig = serverResult.config
    const serverInstance = serverResult.instance
    this.getServerConfigList().map(item => {
      if (item.id === id) {
        console.log(merge(serverConfig, data))
        return merge(serverConfig, data)
      } else {
        return item
      }
    })
    serverInstance.setConfig(this.getServer(id).config, true)
  }
  // 合并Location的配置
  mergeLocationConfig (id, data) {
    const locationResult = this.getLocation(id)
    const locationConfig = locationResult.config
    const locationInstance = locationResult.instance
    this.getLocationConfigList().map(item => {
      if (item.id === id) {
        return merge(locationConfig, data)
      } else {
        return item
      }
    })
    locationInstance.setConfig(this.getLocation(id).config)
  }
  // 获取所有的server
  getServerConfigList () {
    return this.config.allProject || []
  }
  // 获取某个server
  getServer (id) {
    const serverConfig = this.getServerConfigList().find(item => item.id === id)
    const serverInstance = this.serverList.find(item => item.id === id)
    return serverConfig && serverInstance ? {
      config: serverConfig,
      instance: serverInstance
    } : null
  }
  getLocationConfigList () {
    return this.getServerConfigList().reduce((locationList, current) => {
      locationList.push(...current.server.locations)
      return locationList
    }, [])
  }
  // 获取其中一个Location
  getLocation (id) {
    const locationConfig = this.getLocationConfigList().find(item => item.id === id)
    const locationInstance = this.serverList.reduce((locationList, current) => {
      locationList.push(...current.locationList)
      return locationList
    }, []).find(item => item.id === id)
    return locationConfig && locationInstance ? {
      config: locationConfig,
      instance: locationInstance
    } : null
  }
  // 重启Core
  reload () {
    this.destroyResources()
    this.initServers()
  }
  // 初始化Servers
  initServers () {
    this.serverList = []
    this.initHandler()
    this.serversConfig.map(serverConfig => {
      // 合并默认配置
      serverConfig = merge(defaultServerOption(), serverConfig)
      serverConfig.id = serverConfig.id || getId(`server-${serverConfig.type}`)
      const instance = new Server({ config: serverConfig, handler: this.handler })
      this.serverList.push(instance)
    })
  }
  // 初始化Koa对象
  initHandler () {
    this.handler = new Koa()
    this.handler.use(async (ctx, next) => {
      const urlObj = urlParser(ctx.request.href)
      const port = parseInt(urlObj.port) || (urlObj.protocol === 'https' ? 443 : 80)
      // TODO: 可以根据port和host分类，提高性能
      for (const server of this.serverList) {
        if (server.match({ urlObj, port })) {
          await server.action(ctx, () => {})
          break
        }
      }
      // console.log(ctx.request.url, ctx.request.rawUrl)
      await next()
    })
  }
  setServerConfig (id, config = {}) {
    if (config.type && this.serverList) {
      const server = this.serverList.find(item => item.id === config.id)
      server.setConfig(merge(defaultServerOption(), server.config, config))
    }
  }
  // 销毁Servers
  destroyServers () {
    for (const serverListIndex in this.serverList) {
      const serverListItem = this.serverList[serverListIndex]
      serverListItem.destroy && serverListItem.destroy()
    }
    this.serverList = []
  }
  // 销毁所有资源
  destroyResources () {
    this.destroyServers()
    this.handler = null
  }
  // 销毁Core
  destroy () {
    this.destroyResources()
  }
}
