import axios from '../index'

export const getServers = (params) => {
  return axios.get('/plugin/Proxy/list')
}

export const addServer = (params) => {
  return axios.post('/plugin/Proxy/add', params)
}

// export const deletePlugin = (params) => {
//   return axios.delete(`/api/plugins/delete?name=${params.name}`)
// }
