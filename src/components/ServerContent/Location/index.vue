<template>
  <Card tag="li" v-if="location" class="location-card">
    <location-content :location="location"></location-content>
  </Card>
</template>

<script>
import LocationContent from './Content'
export default {
  name: 'LocationCard',
  props: {
    location: {
      type: Object
    }
  },
  components: {
    LocationContent
  }
}
</script>

<style lang="scss">
  .location-card {
    &:hover {
      .move-icon {
        display: block;
      }
      .arrow-icon {
        display: none;
      }
    }
  }
</style>
