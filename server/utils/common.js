export const sleep = (time, data) => new Promise(resolve => {
  setTimeout(() => {
    resolve(data)
  }, time)
})
