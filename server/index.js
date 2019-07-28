import packageJson from '../package.json'
import Proxy from './proxy'
import path from 'path'

export default {
  packageJson,
  tabName: 'Proxy',
  viewType: 'vue',
  frontend: path.join(__dirname, '../dist'),
  frontendDev: 'http://localhost:8988',
  config: 'config.json',
  projectSelector: false,
  main: Proxy
}
