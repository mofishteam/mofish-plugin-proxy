<template>
  <div class="server-content" v-if="content">
  </div>
</template>

<script>
export default {
  name: 'ServerContent',
  props: {
    content: {
      default: null,
      type: Object
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/style/base.scss";
  .server-content {
    width: 100%;
    height: calc(100vh - #{$title-bar-height});
    background-color: $main-white;
  }
</style>
