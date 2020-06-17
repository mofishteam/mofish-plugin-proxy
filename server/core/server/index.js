import MitmServer from './mitm'
import ChildServer from './child'

// 根据options.type判断返回一个Server对象
export default function (options) {
  const { config = {} } = options
  console.log(config.type)
  switch (config.type) {
    case 'child': return new ChildServer(options)
    case 'mitm': return new MitmServer(options)
  }
}
