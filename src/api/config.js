import http from './index'

export const getConfig = () => http('getConfig')

export const setConfig = (data) => http('setConfig', data)
