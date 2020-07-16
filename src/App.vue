<template>
  <div id="app" style="-webkit-app-region: drag">
    <left-menu></left-menu>
    <top-tab>
      <router-view/>
    </top-tab>
  </div>
</template>

<script>
import eventBus from '@/store/eventBus'
import LeftMenu from '@/components/layout/LeftMenu.vue'
import TopTab from '@/components/layout/TopTab.vue'
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
  },
  components: {
    LeftMenu,
    TopTab
  }
}
</script>

<style lang="scss">
  #app {
    display: flex;
    width: 100vw;
    height: 100vh;
  }
</style>
