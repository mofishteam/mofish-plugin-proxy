import MitmServer from './mitm'
import ChildServer from './child'

// 根据options.type判断返回一个Server对象
export default function ({ config = {}, handler }) {
  console.log(config.type)
  switch (config.type) {
    case 'child': return new ChildServer({ config: config, handler })
    case 'mitm': return new MitmServer({ config: config, handler })
  }
}
