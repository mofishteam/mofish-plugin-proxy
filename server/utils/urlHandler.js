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
import urlParser from 'url-parse'

const order = ['exact', 'priorPrefix', 'regexp', 'prefix']

export default class UrlHandler {
  constructor (initialHandlers) {
    this.initHandlers(initialHandlers)
  }
  initHandlers (initialHandlers = []) {
    this.handlers = {
      regexp: [],
      exact: [],
      prefix: [],
      priorPrefix: []
    }
    for (const { url = '', callback = () => {} } of initialHandlers) {
      this.register(url, callback)
    }
  }
  delete () {}
  register (url, callback) {
    const classify = this.urlClassify(url)
    const { type } = classify
    // 前缀匹配要把长的放到前面，list呈前长后短排列
    if (type === 'prefix' || type === 'priorPrefix') {
      const pureUrl = this.getPureUrl(url)
      const list = this.handlers[type]
      // TODO: 后面改成二分查找
      const index = list.findIndex(item => item.length >= pureUrl.length) || 0
      list.splice(index, 0, {
        match: this.urlToMatchFunction(url, classify),
        rawUrlStr: url,
        callback
      })
    } else {
      this.handlers[type].push({
        match: this.urlToMatchFunction(url, classify),
        rawUrlStr: url,
        callback
      })
    }
  }
  match (url) {
    // 所有的匹配捏成一个一维列表
    const result = order.reduce((sum, label) => {
      sum.push(...this.handlers[label])
      return sum
    }, []).find(item => item.match(url))
    return result
  }
  // url分类
  urlClassify (url) {
    let [rule, pattern] = url.includes(' ') ? url.split(' ') : ['', url]
    switch (rule) {
      case '=': return { type: 'exact', pattern }
      case '~': return { type: 'regexp', strict: true, pattern }
      case '~*': return { type: 'regexp', strict: false, pattern }
      case '^~': return { type: 'priorPrefix', pattern }
      case '': return { type: 'prefix', pattern }
    }
  }
  // url转换正则匹配
  urlToMatchFunction (url, classify) {
    // 匹配带冒号的参数
    const pattern = classify.pattern.replace(/\/:[\s\S]+/g, '/[\\s\\S]+')
    switch (classify.type) {
      case 'exact': return url => new RegExp(`^${pattern}$`).test(url)
      case 'regexp': return url => new RegExp(pattern, classify.strict ? '' : 'i').test(url) // 正则加上i为不区分大小写
      // 前缀匹配，包括啥都没有的和^~
      default: return url => new RegExp(`^${pattern}`).test(url)
    }
  }
  // 获取纯url
  getPureUrl (url) {
    return urlParser(url).hostname
  }
}
