import { defaultLocationOption, defaultServerOption } from '../commonUtils/options'
import { merge } from 'lodash'

export default class ProxyObj {
  constructor ({ libs, utils, eventBus, plugins, pluginObjects, name }) {
    this.name = name
    this.libs = libs
    this.utils = utils
    this.eventBus = eventBus
    this.plugins = plugins
    this.pluginObjects = pluginObjects
    this.config = utils.getConfig()
    this.settings = this.config.settings
    this.projects = this.config.projects
    this.setEvents()
  }
  setEvents () {
    // this.eventBus.$on('projectChange', this.onProjectChange)
    // this.eventBus.$on(`plugin-request-${this.name}`, this.request)
  }
  async request (ctx, next) {
    console.log('request')
    const method = ctx.request.method
    switch (method) {
      case 'GET': switch (ctx.request.pluginUrl) {
        case '/list': await this.getProxyList(ctx)
      } break
      case 'POST': switch (ctx.request.pluginUrl) {
        case '/add': await this.addProxy(ctx)
      } break
    }
    await next()
  }
  async getProxyList (ctx) {
    const config = this.utils.getConfig()
    // allProject: 所有项目中都显示的项
    this.utils.response(ctx, 200, config.allProject || [])
  }
  async addProxy (ctx) {
    const body = ctx.request.body
    if (!this.utils.check(body, [['name', 'string']])) {
      this.utils.response(ctx, 400, null, {
        message: 'Param error, check it and retry.'
      })
    } else {
      this.utils.setConfig(this.name, (config) => {
        const result = merge(defaultServerOption(), body)
        for (const locationIndex in result.server.locations) {
          const location = result.server.locations[locationIndex]
          result.server.locations[locationIndex] = merge(defaultLocationOption(), location)
        }
        config.allProject = config.allProject || []
        config.allProject.push(result)
        this.utils.response(ctx, 200, result)
        return config
      })
    }
  }
  destroy () {
    // this.eventBus.$off(`plugin-request-${this.name}`, this.request)
  }
}
