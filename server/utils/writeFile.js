import fs from 'fs'

export const tryMkdir = (dirPath) => new Promise(resolve => {
  fs.stat(dirPath, (err) => {
    if (err) {
      fs.mkdirSync(dirPath)
    }
    resolve()
  })
})

export const tryMkdirLoop = async (dirPath) => {
  const splitPath = dirPath.replace(/\/[^/]*?\.json$/, '').replace(/^\//, '').split('/')
  console.log(splitPath, dirPath, dirPath.replace(/\/[\s\S]*?\.json$/, ''))
  let tempPath = ''
  for (const pathItem of splitPath) {
    tempPath += '/' + pathItem
    await tryMkdir(tempPath)
  }
}

export const writeFile = async (filePath, content) => {
  await tryMkdirLoop(filePath)
  return new Promise(resolve => {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error(err)
      } else {
        resolve()
      }
    })
  })
}
