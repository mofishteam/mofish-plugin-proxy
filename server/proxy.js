import { defaultLocationOption, defaultServerOption } from '../commonUtils/options'
import { merge } from 'lodash'
import { addChild, closeChild, restartChild } from './proxyServer'

export default class ProxyObj {
  constructor ({ libs, utils, eventBus, plugins, pluginObjects, name }) {
    this.name = name
    this.libs = libs
    this.utils = utils
    global.utils = utils
    this.eventBus = eventBus
    this.plugins = plugins
    this.pluginObjects = pluginObjects
    this.config = utils.getConfig()
    this.settings = this.config.settings
    this.projects = this.config.projects
    this.setEvents()
    this.startServers()
    // addChild({id: 1, listen: 8908})
  }
  setEvents () {
    // this.eventBus.$on('projectChange', this.onProjectChange)
    // this.eventBus.$on(`plugin-request-${this.name}`, this.request)
  }
  startServers () {
    console.log(this.config)
    if (this.config.allProject && this.config.allProject.length) {
      for (const server of this.config.allProject) {
        console.log('server: ', server)
        addChild(server)
      }
    }
  }
  async request (ctx, next) {
    console.log('request')
    const method = ctx.request.method
    console.log(method)
    switch (method) {
      case 'GET': switch (ctx.request.pluginUrlObj.pathname) {
        case '/list': await this.getProxyList(ctx)
      } break
      case 'POST': switch (ctx.request.pluginUrlObj.pathname) {
        case '/add': await this.addProxy(ctx)
      } break
      case 'PUT': switch (ctx.request.pluginUrlObj.pathname) {
        case '/save': await this.saveProxy(ctx)
      } break
      case 'DELETE': switch (ctx.request.pluginUrlObj.pathname) {
        case '/delete': await this.deleteProxy(ctx)
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
        addChild(result)
        this.utils.response(ctx, 200, result)
        return config
      })
    }
  }
  async saveProxy (ctx) {
    const body = ctx.request.body
    if (!this.utils.check(body, [['id', 'string'], ['name', 'string'], ['server', 'object']])) {
      this.utils.response(ctx, 400, null, {
        message: 'Param error, check it and retry.'
      })
    } else {
      this.utils.setConfig(this.name, (config) => {
        for (const proxyIndex in config.allProject || []) {
          if (config.allProject[proxyIndex].id === body.id) {
            config.allProject[proxyIndex] = body
            restartChild(body)
            this.utils.response(ctx, 200, body)
            return config
          }
        }
        this.utils.response(ctx, 404, null, {
          message: `Cannot find Server id "${body.id}"`
        })
        return config
      })
    }
  }
  async deleteProxy (ctx) {
    const query = ctx.request.query
    if (!this.utils.check(query, [['id', 'string']])) {
      this.utils.response(ctx, 400, null, {
        message: 'Param error, check it and retry.'
      })
    } else {
      this.utils.setConfig(this.name, (config) => {
        for (const proxyIndex in config.allProject || []) {
          if (config.allProject[proxyIndex].id === query.id) {
            config.allProject.splice(proxyIndex, 1)
            closeChild(query.id)
            this.utils.response(ctx, 200, query)
            return config
          }
        }
        this.utils.response(ctx, 404, null, {
          message: `Cannot find Server id "${query.id}"`
        })
        return config
      })
    }
  }
  destroy () {
    // this.eventBus.$off(`plugin-request-${this.name}`, this.request)
  }
}
