<template>
  <li class="top-tab-item">
    <svg class="top-tab-item_background">
      <g>
        <svg width="52%" height="100%">
          <use xlink:href="#chrome-tab-geometry-left" width="214" height="36" class="chrome-tab-geometry"></use>
        </svg>
      </g>
      <g transform="scale(-1, 1)">
        <svg width="52%" height="100%" x="-100%" y="0">
          <use xlink:href="#chrome-tab-geometry-right" width="214" height="36"
               class="chrome-tab-geometry"></use>
        </svg>
      </g>
    </svg>
  </li>
</template>

<script>
export default {
  name: 'TopItem'
}
</script>

<style lang="scss">
  .top-tab-item {
    position: relative;
    &_background {
      fill: #fff;
      transition: all .3s;
      width: calc(100% + 8px);
      height: 100%;
      position: absolute;
      top: 0;
      left: -4px;
    }
  }
</style>
