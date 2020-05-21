import MitmServer from './mitm'
import ProxyServer from './proxy'

export default function (options) {
  switch (options.type) {
    case 'proxy': return ProxyServer
    case 'mitm': return MitmServer
  }
}
