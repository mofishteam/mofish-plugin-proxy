<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Card'
}
</script>

<style lang="scss">
  @import "~@/assets/style/base.scss";
  .card {
    background-color: $fifth-level-border-color;
    border-radius: $main-border-radius;
    padding: $main-padding;
  }
</style>
