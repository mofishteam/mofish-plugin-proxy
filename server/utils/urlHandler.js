/*
* 使用nginx的那一套匹配规则
* 优先级：精确匹配 > 前缀匹配（^~） > 正则 > 普通前缀匹配（无修饰符）
* 优先级中满足其中一种类型，将不会再往下查找
* 精确匹配（=）：nginx中是根据系统来决定是否忽略大小写，这里我直接强制区别大小写；忽略query；需要ctx.url跟注册的url全等，多一个都不行
* 前缀匹配（^~）：满足前缀相同，不管后面接的是 / 还是字母都可；不管注册顺序，取最长
* 正则（~）：后面接正则；区分大小写
* 正则（~*）：后面接正则；不区分大小写
* 普通前缀匹配（啥也不带）：与前缀匹配（^~）的区别就是优先级小于正则
* */

const order = ['exact', 'priorPrefix', 'regexp', 'prefix']

export default class UrlHandler {
  constructor () {
    this.handlers = {
      regexp: [],
      exact: [],
      prefix: [],
      priorPrefix: []
    }
  }
  register (url, callback) {
    const type = this.urlClassify(url)
    // 前缀匹配要把长的放到前面，list呈前长后短排列
    if (type === 'prefix' || type === 'priorPrefix') {
      const pureUrl = this.getPureUrl(url)
      const list = this.handlers[type]
      // TODO: 后面改成二分查找
      const index = list.findIndex(item => item.length >= pureUrl.length) || 0
      list.splice(index, 0, {
        regex: this.urlToRegex(url),
        callback
      })
    } else {
      this.handlers[type].push({
        regex: this.urlToRegex(url),
        callback
      })
    }
  }
  match (url) {
    // 所有的匹配捏成一个一维列表
    const matchList = order.reduce((sum, label) => {
      sum.push(...this.handlers[label])
      return sum
    }, [])
  }
  // url分类
  urlClassify (url) {}
  // url转换正则匹配
  urlToRegex (url) {}
  // 获取纯url
  getPureUrl () {}
}
