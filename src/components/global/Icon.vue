<template>
  <i :class="[`el-${type}`, 'common-icon']"></i>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    type: {
      type: String
    }
  }
}
</script>
