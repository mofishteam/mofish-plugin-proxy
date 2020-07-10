import { program } from 'commander'
import PackageJson from '../package'
import ipcClientGenerator from '../ipc/client'
import enterCommandMode from './commandMode'

// program.command('command')
//   .description('Command mode.')
//   .action(() => {
//     console.log('command')
//   })

const ipcClientSend = null

const connectCore = async () => {
  return ipcClientSend || await ipcClientGenerator()
}

program.version(PackageJson.version)
  .option('-c, --config', 'Path of config file.')
  .option('--command', 'Command mode.', async () => {
    await enterCommandMode(connectCore)
  })
  .parse(process.argv)
