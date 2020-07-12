import http from 'http'
import Location from './location'
import UrlHandler from '../../utils/urlHandler'
import { getId } from '../../commonUtils/options'

export default class Server {
  constructor ({ config = {}, handler }) {
    this.id = config.id || getId('server')
    this.handler = handler
    this.setConfig(config)
    this.initUrlHandler()
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
  setConfig (config, silence = false) {
    this.config = config
    if (this.config.close) {
      this.close()
    } else {
      if (!silence) {
        this.reload()
      }
    }
  }
  reload () {
    this.close()
    this.init()
  }
  init () {
    // 新增端口监听，可通过this.httpServer.close()关闭监听
    this.httpServer = http.createServer(this.handler.callback()).listen(this.config.server.listen)
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
    this.httpServer && this.httpServer.close()
    this.destroyResources()
  }
  destroyResources () {
    this.httpServer = null
    this.removeAllLocations()
  }
  destroy () {
    this.close()
  }
}
