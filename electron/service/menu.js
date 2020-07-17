import register from '../api'
import ElectronStore from 'electron-store'

const electronStore = new ElectronStore()
const menu = electronStore.get('menu')

register('getMenu', (data) => {
  return menu || []
})

register('setMenu', (data) => {
  return electronStore.set('menu', data || [])
})
