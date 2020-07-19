import path from 'path'
import os from 'os'
import fs from 'fs'

const HOME_DIR = os.homedir()

export default async function ({ core, params, reply }) {
  switch (params.name) {
    case 'menu.json': reply(fs.readFileSync(path.join(HOME_DIR, '.mofish-plugin-proxy/menu.json')).toString()); break
  }
}
