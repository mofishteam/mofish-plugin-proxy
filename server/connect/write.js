import { writeFile } from '../utils/writeFile'
import path from 'path'
import os from 'os'

const HOME_DIR = os.homedir()

export default async function ({ core, params, reply }) {
  switch (params.name) {
    case 'menu.json': await writeFile(path.join(HOME_DIR, '.mofish-plugin-proxy/menu.json'), params.content); break
  }
  reply({ type: 'success' })
}
