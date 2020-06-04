import merge from 'lodash.merge'
import Koa from 'koa'
import getServerInstance from './server/index'
import { defaultServerOption, getId } from '../commonUtils/options'

// 核心类，用来收集Server和下发配置
export default class Core {
  constructor ({ config = {} }) {
    this.config = {}
    this.setConfig(config)
  }
  // 设置Config
  setConfig (config) {
    this.config = merge(this.config, config)
    this.serversConfig = this.config.allProject
    this.reload()
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
      const instance = getServerInstance({ config: serverConfig, handler: this.handler })
      this.serverList.push(instance)
    })
  }
  // 初始化Koa对象
  initHandler () {
    this.handler = new Koa()
    this.handler.use(async (ctx, next) => {
      const port = parseInt((((/:[\d]+($|\/)/).exec(ctx.request.header.host) || [80])[0] + '').replace(':', ''))
      const domain = ctx.request.header.host.replace(`:${port}`, '')
      for (const serverItem of this.serverList) {
        await serverItem.request({ port, domain }, ctx)
      }
      await next()
    })
  }
  setServerConfig (id, config = {}) {
    if (this.serverList) {
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
