import http from 'http'
import https from 'https'
import fs from 'fs'
import Location from './location'
import UrlHandler from '../../utils/urlHandler'
import { getId } from '../../commonUtils/options'
import getPort from 'get-port'

export default class Server {
  constructor ({ config = {}, handler }) {
    this.id = config.id || getId('server')
    this.handler = handler;
    (async () => {
      await this.setConfig(config)
      this.initUrlHandler()
    })()
  }
  initUrlHandler () {
    this.urlHandler = new UrlHandler(
      this.locationList.map((location) => {
        return {
          url: location.config.url,
          callback: () => location
        }
      })
    )
  }
  async setConfig (config, silence = false) {
    this.config = config
    if (this.config.close) {
      await this.close()
    } else {
      if (!silence) {
        await this.reload()
      }
    }
  }
  async reload () {
    await this.close()
    await this.init()
  }
  async init () {
    const options = this.config.server.ssl ? {
      key: fs.readFileSync(this.config.server.sslOptions.key, 'utf8'),
      cert: fs.readFileSync(this.config.server.sslOptions.cert, 'utf8')
    } : {}
    const isPortAvailable = (await getPort({ port: +this.config.server.listen })) === +this.config.server.listen
    console.log('isPortAvailable', isPortAvailable)
    // 新增端口监听，可通过this.httpServer.close()关闭监听
    this.httpServer = (this.config.server.ssl ? https : http).createServer(options, this.handler.callback()).listen(this.config.server.listen)
    this.reloadLocations()
    console.log('Server is listening ' + this.config.server.listen)
  }
  // 匹配路由
  match ({ urlObj, port }) {
    return port === this.config.server.listen && this.config.server.name.includes(urlObj.hostname)
  }
  async action (ctx, next) {
    console.log('server action', ctx.url)
    const handlerResult = this.urlHandler.match(ctx.url)
    const location = handlerResult.callback()
    await location.action(ctx, next)
  }
  // 单纯splice或者单纯push会造成顺序错乱，暂时采用全删重置的方法
  removeAllLocations () {
    if (this.locationList && this.locationList.length) {
      for (const location of this.locationList) {
        location.destroy()
      }
    }
    this.locationList = []
  }
  // 重置LocationList
  reloadLocations () {
    this.removeAllLocations()
    // 反过来让后面的细则覆盖前面的通配
    this.config.server.locations.forEach(locationConfig => {
      this.locationList.push(new Location({ config: locationConfig, serverConfig: this.config, id: locationConfig.id }))
    })
  }
  // 关闭Server
  close () {
    return new Promise(resolve => {
      if (this.httpServer) {
        this.httpServer.close(() => {
          resolve(this.httpServer)
          this.destroyResources()
        })
      } else {
        resolve(null)
      }
    })
  }
  destroyResources () {
    this.httpServer = null
    this.removeAllLocations()
  }
  async destroy () {
    await this.close()
  }
}
