<template>
  <div class="top-tab">
    top-tab
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TopTab',
  data () {
    return {
      active: 0
    }
  },
  methods: {}
}
</script>

<style lang="scss">
  .top-tab {
    flex: 1;
    -webkit-app-region: drag;
  }
</style>
