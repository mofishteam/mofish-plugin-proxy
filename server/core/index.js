import merge from 'lodash.merge'

export default class Core {
  constructor ({ config = {} }) {
    this.config = {}
    this.setConfig(config)
  }
  // 设置Config
  setConfig (config) {
    this.config = merge(this.config, config)
    this.reload()
  }
  // 重启Core
  reload () {}
  // 销毁所有资源
  destroyChildren () {}
  // 销毁Core
  destroy () {
    this.destroyChildren()
  }
}
