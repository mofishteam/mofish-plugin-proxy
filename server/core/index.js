import merge from 'lodash.merge'
import Koa from 'koa'
import Server from './server/index'
import { defaultServerOption, getId } from '../commonUtils/options'
import urlParser from 'url-parse'

// 核心类，用来收集Server和下发配置
export default class Core {
  constructor ({ config = {} }) {
    this.config = {}
    this.setConfig(config)
  }
  /*
  * 设置Config
  * @param config 配置JSON
  * @param silence 是否触发重载
  * */
  setConfig (config, silence = false) {
    this.config = merge(this.config, config)
    this.serversConfig = this.config.allProject
    if (!silence) {
      this.reload()
    }
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
