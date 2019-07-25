import packageJson from './package'
import Proxy from './proxy'
import path from 'path'

export default {
  packageJson,
  tabName: 'Proxy',
  viewType: 'iframe',
  frontend: path.join(__dirname, './dist'),
  frontendDev: 'http://localhost:8890',
  config: 'config.json',
  module: Proxy
}
