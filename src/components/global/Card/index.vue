<template>
  <component :is="tag" class="card">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'Card',
  props: {
    tag: {
      type: String,
      default: 'div'
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/style/base.scss";
  .card {
    background-color: $fifth-level-border-color;
    border-radius: $main-border-radius;
    padding: $main-padding;
    & + .card {
      margin-top: $main-padding;
    }
  }
</style>
