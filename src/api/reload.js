import http from './index'

export const reload = (params) => http('raw', {
  type: 'reload',
  params
})
