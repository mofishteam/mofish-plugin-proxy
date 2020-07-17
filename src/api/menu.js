import http from './index'

export const getMenu = () => http('getMenu')

export const setMenu = (data) => http('setMenu', data)
