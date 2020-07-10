import inquirer from 'inquirer'

export default async function (connectCore) {
  const ipc = await connectCore()
  let isClose = false
  while (!isClose) {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'command',
        message: 'Please input the Command Json.'
      }
    ]).then((answers) => {
      ipc('operation', answers.command).then(res => {
        console.log('res: ', res)
      })
      // 退出命令模式
      if (answers.command === 'exit' || answers.command === 'exit()') {
        console.log('Bye!')
        isClose = true
        process.exit()
      }
    })
  }
}
