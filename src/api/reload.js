import http from './index'

export const getConfig = () => http('raw', {
  type: 'get',
  params: {
    name: 'servers'
  }
})

export const setConfig = (params) => http('raw', {
  type: 'set',
  params
})
