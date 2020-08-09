<template>
  <div class="location-content">
    <div class="location-content_row">
      <Icon type="icon-bottom-right" class="location-content_icon arrow-icon"></Icon>
      <Icon type="icon-rank" class="location-content_icon move-icon"></Icon>
      <p class="location-content_url">{{location.url}}</p>
    </div>
    <div class="location-content_row"></div>
  </div>
</template>

<script>
export default {
  name: 'LocationContent',
  props: {
    location: {
      type: Object
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/style/base.scss";
  .location-content {
    .location-content_icon {
      color: $main-color;
      margin-right: $main-padding / 2;
      cursor: move;
      &.move-icon {
        display: none;
      }
    }
    .location-content_url {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .location-content_row {
      display: flex;
      align-items: center;
      & + .location-content_row {
        margin-top: $main-padding;
      }
    }
  }
</style>
