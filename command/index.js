import Commander from 'commander'
import PackageJson from '../package'
import Core from '../server/core'
import fs from 'fs'

Commander.version(PackageJson.version)
  .option('-c, --config', 'Path of config file.')

export default function CommandInputHandler (command) {
  if (command.config) {
    try {
      const config = typeof command.config === 'object' ? command.config : JSON.parse(fs.readFileSync(command.config).toString())
      const core = new Core({ config })
      console.log(core)
    } catch (err) {
      console.error('Error when handling config file.')
      throw new Error(err)
    }
  }
}
