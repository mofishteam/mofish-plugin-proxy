import axios from '../index'

export const getServers = (params) => {
  return axios.get('/plugin/Proxy/list')
}

export const addServer = (params) => {
  return axios.post('/plugin/Proxy/add', params)
}

export const saveServer = (params) => {
  return axios.put('/plugin/Proxy/save', params)
}

export const deleteServer = (id) => {
  return axios.delete(`/plugin/Proxy/delete?id=${id}`)
}

export const getServerSortList = () => {
  return axios.get('/plugin/Proxy/server/sort-list')
}

export const saveServerSortList = (params) => {
  return axios.put('/plugin/Proxy/server/sort-list', params)
}

export const deleteServerSortItem = (id) => {
  return axios.delete(`/plugin/Proxy/server/sort?id=${id}`)
}

// export const deletePlugin = (params) => {
//   return axios.delete(`/api/plugins/delete?name=${params.name}`)
// }
