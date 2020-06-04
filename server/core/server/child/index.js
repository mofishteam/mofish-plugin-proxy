import http from 'http'
import Location from '../location'

export default class ChildServer {
  constructor ({ config = {}, handler }) {
    this.handler = handler
    this.setConfig(config)
  }
  setConfig (config) {
    // console.log('config: ' + JSON.stringify(config))
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
  async request ({ port, domain }, ctx) {
    // console.log(ctx)
    const serverNameList = this.config.server.name
    // 0.0.0.0全通过，其他需要匹配域名，域名有Core那边传过来的
    if (port === this.config.server.listen && (serverNameList.includes('0.0.0.0') || serverNameList.includes(domain))) {
      // 找到url匹配的Location
      let findLocation = false
      console.log('locationList: ', this.locationList)
      for (const currentLocation of this.locationList) {
        findLocation = await currentLocation.getResponse(ctx)
        if (findLocation) {
          break
        }
      }
      console.log('findLocation: ', findLocation)
    }
  }
  init () {
    console.log('child init', `/port-${this.config.server.listen}`)
    // 新增端口监听，可通过this.httpServer.close()关闭监听
    this.httpServer = http.createServer(this.handler.callback()).listen(this.config.server.listen)
    this.reloadLocations()
    // console.log(this.handler.use)
    console.log('Server is listening ' + this.config.server.listen)
  }
  // 重置LocationList
  reloadLocations () {
    this.locationList = []
    this.config.server.locations.map(locationConfig => {
      this.locationList.push(new Location({ config: locationConfig }))
    })
  }
  // 关闭Server
  close () {
    this.httpServer && this.httpServer.close()
    this.destroyResources()
  }
  destroyResources () {
    this.httpServer = null
    this.locationList = []
  }
  destroy () {
    this.close()
  }
}
