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
  @import "~@/assets/style/base.scss";
  .top-tab {
    flex: 1;
    -webkit-app-region: drag;
    background-color: lighten($main-color, 36%);
  }
</style>
