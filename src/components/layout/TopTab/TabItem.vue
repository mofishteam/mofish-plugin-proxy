<template>
  <li class="top-item">
    <svg>
      <g width="52%" height="100%">
        <use xlink:href="#chrome-tab-geometry-left" width="214" height="36" class="chrome-tab-geometry"></use>
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
  .top-item {
  }
</style>
