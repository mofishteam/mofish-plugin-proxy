import md5 from 'md5'
let idCnt = 0

export const getId = (name) => {
  return md5(name + new Date().valueOf() + idCnt++)
}

export const defaultServerOption = () => ({
  id: md5('server' + new Date().valueOf() + idCnt++),
  include: null,
  name: getId('serverName'),
  server: {
    name: [],
    listen: 8080,
    locations: []
  }
})

export const defaultLocationOption = () => ({
  id: getId('location'),
  url: '/',
  type: 'proxyPass',
  proxyPass: {},
  root: {},
  alias: {}
})

export const defaultLocationProxyPassOption = () => ({
  target: '',
  changeOrigin: true,
  ws: true,
  router: [],
  pathRewrite: []
})
