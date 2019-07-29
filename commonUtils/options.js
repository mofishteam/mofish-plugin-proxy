import md5 from 'md5'
let idCnt = 0

export const defaultServerOption = () => ({
  id: md5('server' + new Date().valueOf() + idCnt++),
  include: null,
  name: md5('serverName' + new Date().valueOf() + idCnt++),
  server: {
    name: [],
    listen: 8080,
    locations: []
  }
})

export const defaultLocationOption = () => ({
  id: md5('location' + new Date().valueOf() + idCnt++),
  url: '/',
  type: 'proxyPass',
  proxyPass: {},
  root: {},
  alias: {}
})
