import { defaultLocationOption, defaultLocationProxyPassOption, defaultServerOption, defaultLocationStaticOption, defaultLocationMockOption } from './commonUtils/options'
import { merge } from 'lodash'
import { addChild, closeChild, restartChild, pauseChild, resumeChild } from './proxyServer'
import { portTest } from './port'

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
  async startServers () {
    if (this.config.allProject && this.config.allProject.length) {
      for (const server of this.config.allProject) {
        if (this.config.closeList && this.config.closeList.includes(server.id)) {
          await addChild(server, true)
        } else {
          await addChild(server)
        }
      }
    }
  }
  async request (ctx, next) {
    const method = ctx.request.method
    switch (method) {
      case 'GET': switch (ctx.request.pluginUrlObj.pathname) {
        case '/list': await this.getProxyList(ctx); break
        case '/port-test': await portTest(ctx); break
        case '/server/close-list': await this.getCloseList(ctx); break
        case '/server/sort-list': await this.getSortList(ctx)
      } break
      case 'POST': switch (ctx.request.pluginUrlObj.pathname) {
        case '/add': await this.addProxy(ctx)
      } break
      case 'PUT': switch (ctx.request.pluginUrlObj.pathname) {
        case '/save': await this.saveProxy(ctx); break
        case '/server/status': await this.setServerStatus(ctx); break
        case '/server/sort-list': await this.saveSortList(ctx)
      } break
      case 'DELETE': switch (ctx.request.pluginUrlObj.pathname) {
        case '/delete': await this.deleteProxy(ctx); break
        case '/server/sort': await this.deleteSortItem(ctx)
      } break
    }
    await next()
  }
  async getProxyList (ctx) {
    const config = this.utils.getConfig()
    const result = config.allProject.map(server => {
      server = merge(defaultServerOption(), server)
      if (server.server.locations && server.server.locations.length) {
        server.server.locations.map(location => {
          location.proxyPass = location.proxyPass || defaultLocationProxyPassOption()
          location.static = location.static || defaultLocationStaticOption()
          location.mock = location.mock || defaultLocationMockOption()
          const defaultProxyPass = defaultLocationProxyPassOption()
          for (const key in defaultProxyPass) {
            if (defaultProxyPass[key] && !location.proxyPass[key]) {
              location.proxyPass[key] = defaultProxyPass[key]
            }
          }
          const defaultStatic = defaultLocationStaticOption()
          for (const key in defaultStatic) {
            if (defaultStatic[key] && !location.static[key]) {
              location.static[key] = defaultStatic[key]
            }
          }
          const defaultMock = defaultLocationMockOption()
          for (const key in defaultMock) {
            if (defaultMock[key] && !location.mock[key]) {
              location.mock[key] = defaultMock[key]
            }
            if (key === 'proxyPass') {
              const defaultMockProxyPass = defaultLocationProxyPassOption()
              for (const mockProxyPassKey in defaultMockProxyPass) {
                if (defaultMockProxyPass[mockProxyPassKey] && !location.mock.proxyPass[mockProxyPassKey]) {
                  location.mock.proxyPass[mockProxyPassKey] = defaultMockProxyPass[mockProxyPassKey]
                }
              }
            }
          }
          return location
        })
      }
      return server
    })
    // allProject: 所有项目中都显示的项
    this.utils.response(ctx, 200, result || [])
  }
  async getCloseList (ctx) {
    const config = this.utils.getConfig()
    // allProject: 所有项目中都显示的项
    this.utils.response(ctx, 200, config.closeList || [])
  }
  async getSortList (ctx) {
    const config = this.utils.getConfig()
    const serverIdList = config.allProject.reduce((sum, cur) => {
      sum.push(cur.id)
      return sum
    }, [])
    const traverse = (children) => {
      const result = []
      for (const child of children) {
        if (child.isDir || serverIdList.includes(child.id)) {
          result.push(child)
          if (child.children) {
            child.children = traverse(child.children)
          }
        }
      }
      return result
    }
    // allProject: 所有项目中都显示的项
    this.utils.response(ctx, 200, traverse(config.sortList || []))
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
  async saveSortList (ctx) {
    const body = ctx.request.body
    if (!this.utils.check(body, [['list', 'object']])) {
      this.utils.response(ctx, 400, null, {
        message: 'Param error, check it and retry.'
      })
    } else {
      this.utils.setConfig(this.name, (config) => {
        if (body.list && body.list.length) {
          config.sortList = body.list
        }
        this.utils.response(ctx, 200, {})
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
  async deleteSortItem (ctx) {
    // 坏了，慎用
    const query = ctx.request.query
    if (!this.utils.check(query, [['id', 'string']])) {
      this.utils.response(ctx, 400, null, {
        message: 'Param error, check it and retry.'
      })
    } else {
      this.utils.setConfig(this.name, (config) => {
        let found = false
        const traverse = (item, id) => {
          if (item && item.children && item.children.length) {
            for (const childIndex in item.children) {
              if (item.children[childIndex].id === id) {
                delete item.children[childIndex]
                found = true
              } else if (item.children[childIndex].children) {
                traverse(item.children[childIndex], id)
              }
            }
          }
        }
        traverse({
          children: config.sortList || []
        })
        if (!found) {
          this.utils.response(ctx, 404, null, {
            message: `Cannot find Server Sort id "${query.id}"`
          })
        } else {
          this.utils.response(ctx, 200, null)
        }
        return config
      })
    }
  }
  async setServerStatus (ctx) {
    const body = ctx.request.body
    if (!this.utils.check(body, [['id', 'string'], ['close', 'boolean']])) {
      this.utils.response(ctx, 400, null, {
        message: 'Param error, check it and retry.'
      })
    } else {
      await this.utils.setConfig(this.name, async (config) => {
        const closeList = new Set(config.closeList)
        if (body.close) {
          closeList.add(body.id)
          await pauseChild(body.id)
        } else {
          await resumeChild(body.id)
          closeList.delete(body.id)
        }
        config.closeList = [...closeList]
        this.utils.response(ctx, 200, null)
        return config
      })
    }
  }
  destroy () {
    // this.eventBus.$off(`plugin-request-${this.name}`, this.request)
  }
}
