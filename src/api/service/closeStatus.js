import axios from '../index'

export const getCloseList = (params) => {
  return axios.get('/plugin/Proxy/server/close-list')
}

export const setServerStatus = (params) => {
  return axios.put('/plugin/Proxy/server/status', params)
}
