import http from 'http'
// import Router from 'koa-router'
import Location from '../location'

export default class ChildServer {
  constructor ({ config = {}, handler, router }) {
    this.handler = handler
    console.log('router', router)
    this.router = router
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
  init () {
    console.log('child init', `/port-${this.config.server.listen}`)
    // 新增端口监听，可通过this.httpServer.close()关闭监听
    this.httpServer = http.createServer(this.handler.callback()).listen(this.config.server.listen)
    // const router = new Router()
    this.reloadLocations()
    // router.all(new RegExp(`^/port-${this.config.server.listen}`), async (ctx, next) => {
    //   console.log(ctx)
    //   const serverNameList = this.config.server.name
    //   // 0.0.0.0全通过，其他需要匹配域名，域名有Core那边传过来的
    //   if (serverNameList.includes('0.0.0.0') || serverNameList.includes(ctx.request.domain)) {
    //     // 找到url匹配的Location
    //     let findLocation = false
    //     console.log('locationList: ', this.locationList)
    //     for (const currentLocation of this.locationList) {
    //       findLocation = await currentLocation.getResponse(ctx)
    //       if (findLocation) {
    //         break
    //       }
    //     }
    //     console.log('findLocation: ', findLocation)
    //   }
    //   await next()
    // })
    // console.log(this.handler.use)
    // this.handler.use(router.routes()).use(router.allowedMethods())
    console.log('Server is listening ' + this.config.server.listen)
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
    this.config.server.locations.map(locationConfig => {
      this.locationList.push(new Location({ config: locationConfig, serverConfig: this.config, router: this.router }))
    })
    console.log(this.router.stack)
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
