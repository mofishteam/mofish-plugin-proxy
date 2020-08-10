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
  @import "~@/assets/style/base.scss";
  .location-card {
    padding-top: $main-padding / 2;
    padding-bottom: $main-padding / 2;
    &:hover {
      .move-icon {
        display: block;
      }
      .arrow-icon {
        display: none;
      }
      .operation-button {
        display: block;
      }
      .location-content_detail {
        overflow: scroll;
        color: $main-text-color;
        &-item {
          opacity: 1;
        }
        &-label {
          transform: scale(1.1);
        }
      }
    }
  }
</style>
