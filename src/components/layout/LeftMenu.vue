<template>
  <div class="left-menu" :style="{width: width + 'px'}">
    left-menu
  </div>
</template>

<script>
export default {
  name: 'LeftMenu',
  data () {
    return {
      width: 300
    }
  },
  methods: {}
}
</script>

<style lang="scss">
  @import "~@/assets/style/base.scss";
  .left-menu {
    height: 100%;
    -ms-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    -webkit-app-region: drag;
    border-right: 1px solid $forth-level-border-color;
  }
</style>
