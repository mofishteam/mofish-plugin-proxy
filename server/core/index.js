import merge from 'lodash.merge'
import Koa from 'koa'
import Server from './server/index'
import { defaultServerOption, getId } from '../commonUtils/options'
import urlParser from 'url-parse'
// import cloneDeep from 'lodash.clonedeep'

// 核心类，用来收集Server和下发配置
export default class Core {
  constructor ({ config = {}, configPath, utils }) {
    this.config = {}
    this.configPath = configPath
    this.utils = utils
    this.setConfig(config, false, true)
  }
  // 所有端口集合
  get portList () {
    const serverConfigList = this.getServerConfigList() || []
    return serverConfigList.reduce((sum, cur) => {
      if (cur.server && cur.server.listen) {
        sum.push(cur.server)
      }
      return sum
    }, [])
  }
  // 去重后的portList
  get uniqPortList () {
    return [...new Set(this.portList)]
  }
  // 是否有重复的port
  get hasConflictPort () {
    return this.portList.length !== this.uniqPortList.length
  }
  /*
  * 设置Config
  * @param config 配置JSON
  * @param silence 是否触发重载
  * @param needDestroy 是否需要先destroy
  * */
  async setConfig (config, silence = false, needDestroy = true) {
    // this.rawConfig = cloneDeep(this.config)
    this.config = merge(this.config, config)
    this.serversConfig = this.config.allProject
    if (!silence) {
      await this.reload(needDestroy)
    }
  }
  // 将config保存到文件
  async saveConfig () {
    return this.utils.writeFile(this.configPath, JSON.stringify(this.config))
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
  async mergeServerConfig (id, data) {
    const serverResult = this.getServer(id)
    // 找到server则修改
    if (serverResult) {
      const serverConfig = serverResult.config
      const serverInstance = serverResult.instance
      console.log('serverInstance', serverInstance)
      this.getServerConfigList().map(item => {
        if (item.id === id) {
          return Object.keys(data).reduce((result, cur) => {
            result[cur] = data[cur]
            return result
          }, serverConfig)
        } else {
          return item
        }
      })
      serverInstance.setConfig(this.getServer(id).config, true)
    } else {
      console.log('not found')
      // 找不到server则添加
      const serverConfigList = this.getServerConfigList()
      console.log('config: ', serverConfigList)
      const newServer = await this.initServerItem(data)
      console.log(newServer)
      if (newServer) {
        const mergedConfig = newServer.config
        serverConfigList.push(mergedConfig)
      }
    }
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
    console.log('id', id)
    if (!id) return null
    const serverConfig = this.getServerConfigList().find(item => item.id === id)
    const serverInstance = this.serverList.find(item => item.id === id)
    console.log(serverConfig, serverInstance)
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
    if (!id) return null
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
  async reload (needDestroy = true) {
    needDestroy && await this.destroyResources()
    await this.initServers()
  }
  // 初始化Servers
  async initServers () {
    this.serverList = []
    this.initHandler()
    for (const serverConfig of this.serversConfig) {
      await this.initServerItem(serverConfig)
    }
  }
  // 初始化单个Server
  async initServerItem (serverConfig) {
    console.log('serverConfig.id ', serverConfig.id)
    // if (!this.getServer(serverConfig.id)) return null
    // 合并默认配置
    try {
      serverConfig = merge(defaultServerOption(), serverConfig)
      serverConfig.id = serverConfig.id || getId(`server-${serverConfig.type}`)
    } catch (err) {
      console.log(err)
    }
    const instance = new Server({ config: serverConfig, handler: this.handler })
    await new Promise(resolve => {
      instance.$on('ready', () => {
        console.log('ready')
        resolve()
      })
    }).catch(err => {
      throw new Error(err)
    })
    this.serverList.push(instance)
    return {
      config: serverConfig,
      instance
    }
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
  async setServerConfig (id, config = {}) {
    if (config.type && this.serverList) {
      const server = this.serverList.find(item => item.id === config.id)
      await server.setConfig(merge(defaultServerOption(), server.config, config))
    }
  }
  // 销毁Servers
  async destroyServers () {
    for (const serverListIndex in this.serverList) {
      const serverListItem = this.serverList[serverListIndex]
      serverListItem.destroy && await serverListItem.destroy()
    }
    this.serverList = []
  }
  // 销毁所有资源
  async destroyResources () {
    await this.destroyServers()
    this.handler = null
  }
  // 销毁Core
  async destroy () {
    await this.destroyResources()
  }
}
