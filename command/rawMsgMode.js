import inquirer from 'inquirer'

export default async function (connectCore, preMsg) {
  const ipc = await connectCore()
  let isClose = false
  const sendMsg = (msg) => {
    if (typeof msg === 'string') {
      msg = JSON.parse(msg)
    }
    return ipc('operation', msg).then(res => {
      console.log('raw message: \n'.blue, msg)
      console.log('core reply: \n'.blue, res)
      return res
    })
  }
  if (preMsg) {
    await sendMsg(preMsg)
    process.exit()
  } else {
    while (!isClose) {
      await inquirer.prompt([
        {
          type: 'editor',
          name: 'message',
          message: 'Please input the Command Json.'
        }
      ]).then((answers) => {
        sendMsg(answers.message)
        // 退出命令模式
        if (answers.message === 'exit' || answers.message === 'exit()') {
          console.log('Bye!')
          isClose = true
          process.exit()
        }
      })
    }
  }
}
