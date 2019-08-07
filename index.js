const packageJson = require('./package.json')
const path = require('path')

module.exports.default = isDev => ({
  isDev,
  packageJson,
  tabName: 'Proxy',
  viewType: 'vue',
  frontend: isDev ? 'http://localhost:8988' : path.join(__dirname, './dist'),
  config: 'config.json',
  projectSelector: false,
  main: isDev ? require(path.join(__dirname, './server/proxy.js')).default : require('./server-dist/proxy.js').default
})
