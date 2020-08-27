import http from 'http'
import https from 'https'
import fs from 'fs'
import Location from './location'
import UrlHandler from '../../utils/urlHandler'
import { getId } from '../../commonUtils/options'
import tcpPortUsed from 'tcp-port-used'
import Emitter from '../../utils/eventEmitter'
// import { sleep } from '../../utils/common'

// 端口不可用时重新尝试多少次
const PORT_AVAILABLE_WAIT_TIMES = 10
// 端口不可用时重新尝试间隔
const PORT_AVAILABLE_WAIT_INTERVAL_TIME = 1000

export default class Server extends Emitter {
  constructor ({ config = {}, handler }) {
    super()
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
    if (!silence) {
      await this.reload()
    }
  }
  async reload () {
    if (!this.config.close && await this.close()) {
      this.config.close = false
      await this.init()
    } else {
      throw new Error('Not closed completely.')
    }
  }
  async init () {
    console.log('init')
    const options = this.config.server.ssl ? {
      key: fs.readFileSync(this.config.server.sslOptions.key, 'utf8'),
      cert: fs.readFileSync(this.config.server.sslOptions.cert, 'utf8')
    } : {}
    // 查看端口是否可用
    if (!this.config.close) {
      // 尝试启动
      await tcpPortUsed.waitUntilFree(
        +this.config.server.listen, PORT_AVAILABLE_WAIT_INTERVAL_TIME,
        PORT_AVAILABLE_WAIT_INTERVAL_TIME * PORT_AVAILABLE_WAIT_TIMES
      ).then(async () => {
        // 新增端口监听，可通过this.httpServer.close()关闭监听
        this.httpServer = (this.config.server.ssl ? https : http).createServer(options, (...args) => {
          // TODO: 调研这里要不要用bind，这里需要想办法同步，创建完一个server再传出ready信号
          this.handler.callback()(...args)
        }).listen(this.config.server.listen)
        this.$emit('ready')
        console.log('2222', this.httpServer)
        this.reloadLocations()
        console.log('Server is listening ' + this.config.server.listen)
      }, async (err) => {
        await this.close()
        throw new Error(`Port is not available in Server ${this.config.name}: ${err}`)
      })
    }
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
      console.log('this.httpServer', this.httpServer)
      // undefined的话说明是刚初始化的，null是被关之后赋值的
      if (this.httpServer === undefined) {
        resolve(true)
      }
      if (this.httpServer) {
        this.httpServer.close(() => {
          this.config.close = true
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
