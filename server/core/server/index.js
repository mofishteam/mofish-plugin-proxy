import http from 'http'
import Location from './location'

export default class Server {
  constructor ({ config = {}, handler }) {
    this.handler = handler
    this.setConfig(config)
  }
  setConfig (config) {
    this.config = config
    if (this.config.close) {
      this.close()
    } else {
      this.reload()
    }
  }
  reload () {
    this.destroyResources()
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
    for (const location of this.locationList) {
      if (location.match(ctx)) {
        await location.action(ctx, next)
        break
      }
    }
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
      this.locationList.push(new Location({ config: locationConfig, serverConfig: this.config }))
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
