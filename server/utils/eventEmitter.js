export default class Emitter {
  constructor () {
    this.$events = {}
  }
  $on (eventName, callback) {
    this.$events[eventName] = this.$events[eventName] || []
    this.$events[eventName].push(callback)
  }
  $emit (eventName, data) {
    if (this.$events[eventName] && this.$events[eventName].length) {
      for (const callback of this.$events[eventName]) {
        callback(data)
      }
    }
  }
}
