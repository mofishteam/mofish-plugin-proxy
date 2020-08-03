<template>
  <div id="app">
    <left-menu></left-menu>
    <top-tab>
      <router-view/>
    </top-tab>
  </div>
</template>

<script>
import eventBus from '@/store/eventBus'
import LeftMenu from '@/components/layout/LeftMenu'
import TopTab from '@/components/layout/TopTab/Index.vue'

import { mapActions } from 'vuex'
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
    this.refreshConfig()
  },
  beforeDestroy () {
    document.removeEventListener('keydown', onKeyDown)
  },
  methods: {
    ...mapActions({
      refreshConfig: 'refreshConfig'
    })
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
