import { program } from 'commander'
import PackageJson from '../package'
import ipcClientGenerator from '../ipc/client'
import enterRawMsgMode from './rawMsgMode'
import 'colors'
import commandList from './commandList'

const ipcClientSend = null

const connectCore = async () => {
  return ipcClientSend || await ipcClientGenerator()
}

program.name('mpp')
  .usage('[global options] command')

program
  .command('config <path>')
  .description('Path of config file.')
  .action(async (p) => {
    console.log(p)
  })

// 原始ipc消息模式
program
  .command('raw-msg [msg]')
  .description('Send raw message to mofishd.')
  .action(async (msg) => {
    await enterRawMsgMode(connectCore, msg)
  })

program
  .command('list [type]')
  .description('List Servers or Locations.')
  .option('--server-id', 'List Locations by Server-id.')
  .action(async (type = 'server', command, typeId = '') => {
    await commandList(connectCore, type, typeId)
  })

program.command('test')
  .option('-a')
  .action(() => {
    console.log('test')
  })

program.version(PackageJson.version)
  .parse(process.argv)
