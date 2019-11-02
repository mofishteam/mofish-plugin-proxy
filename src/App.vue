<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import eventBus from '@/store/eventBus'
const onKeyDown = (evt) => {
  if (evt.key === 's' && (evt.ctrlKey || evt.metaKey)) {
    evt.preventDefault()
    eventBus.$emit('saveChange')
  }
}
export default {
  name: 'App',
  created () {
    document.addEventListener('keydown', onKeyDown)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', onKeyDown)
  }
}
</script>

<style lang="scss">
</style>
