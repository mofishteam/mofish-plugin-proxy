<template>
  <div class="top-tab">
    <svg version="1.1" v-show="false" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <symbol id="chrome-tab-geometry-left" viewBox="0 0 214 36">
          <path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z"></path>
        </symbol>
        <symbol id="chrome-tab-geometry-right" viewBox="0 0 214 36">
          <use xlink:href="#chrome-tab-geometry-left"></use>
        </symbol>
        <clipPath id="crop">
          <rect class="mask" width="100%" height="100%" x="0"></rect>
        </clipPath>
      </defs>
    </svg>
    <ul class="top-tab_wrap">
      <tab-item></tab-item>
      <tab-item></tab-item>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
import TabItem from './TabItem'
export default {
  name: 'TopTab',
  data () {
    return {
      active: 0
    }
  },
  methods: {},
  components: {
    TabItem
  }
}
</script>

<style lang="scss">
  @import "~@/assets/style/base.scss";
  .top-tab {
    flex: 1;
    -webkit-app-region: drag;
    background-color: $third-level-border-color;
    .top-tab_wrap {
      height: 34px;
      padding: 8px 3px 4px;
      display: flex;
    }
  }
</style>
