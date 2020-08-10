<template>
  <div class="location-content">
    <div class="location-content_row">
      <Icon type="icon-bottom-right" class="location-content_icon arrow-icon"></Icon>
      <Icon type="icon-rank" class="location-content_icon move-icon"></Icon>
      <p class="location-content_url">{{location.url}}</p>
      <div class="flex-spring"></div>
      <el-button icon="el-icon-edit" type="text" class="operation-button" circle></el-button>
      <el-button icon="el-icon-delete" type="text" class="operation-button text-danger-important" circle></el-button>
    </div>
    <div class="location-content_row location-content_detail-wrap">
      <ul class="location-content_detail">
        <li class="location-content_detail-item">
          <p class="location-content_detail-label">Type: </p>
          <p class="location-content_detail-value text-main">{{location.type}}</p>
        </li>
        <li class="location-content_detail-item">
          <p class="location-content_detail-label">Delay: </p>
          <p class="location-content_detail-value text-main">{{location.delay}}</p>
        </li>
        <li class="location-content_detail-item">
          <p class="location-content_detail-label">Method: </p>
          <p class="location-content_detail-value text-main">{{location.method.toUpperCase()}}</p>
        </li>
      </ul>
    </div>
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
    .operation-button {
      margin-left: 0;
      display: none;
      &:last-of-type {
        margin-right: -1 * $main-padding / 2;
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
      height: 40px;
    }
    .location-content_detail {
      width: 100%;
      overflow: hidden;
      display: flex;
      &-item {
        line-height: 1.6;
        opacity: .8;
        transition: all .3s;
        & + .location-content_detail-item {
          margin-left: $main-padding / 2;
          border-left: 1px solid $second-level-border-color;
          padding-left: $main-padding / 2;
        }
        .location-content_detail-label {
          font-size: 13px;
          color: $common-text-color;
          transition: all .3s;
          transform-origin: left center;
        }
        .location-content_detail-value {
          font-size: 12px;
        }
      }
    }
  }
</style>
