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
  .server-content {}
</style>
