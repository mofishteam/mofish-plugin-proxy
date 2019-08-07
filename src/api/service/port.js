import axios from '../index'

export const getPortTest = (params) => {
  return axios.get(`/plugin/Proxy/port-test?port=${params.port}&id=${params.id}`)
}
