<template>
  <ul class="menu-list">
    <menu-item v-for="item in menus" :key="item.id" :menu-info="item"></menu-item>
  </ul>
</template>

<script>
import MenuItem from './MenuItem'
export default {
  name: 'LeftMenuList',
  props: {
    menus: {
      type: Array,
      default: () => []
    }
  },
  components: {
    MenuItem
  }
}
</script>

<style lang="scss">
  .menu-list {
    -webkit-app-region: no-drag;
  }
</style>
