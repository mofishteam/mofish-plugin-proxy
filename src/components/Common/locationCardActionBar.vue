<template>
  <div :class="['location-list_action-bar', {fixed: isFixed}]">
    <div class="observe-detect-line" ref="line"></div>
    <el-card :shadow="isFixed ? 'always' : 'none'" class="fixed-card" :style="{width: isFixed ? `${width}px` : ''}">
      <div class="location-list_action-bar-left">
        <slot name="left"></slot>
      </div>
      <div class="spring"></div>
      <div class="location-list_action-bar-right">
        <slot name="right"></slot>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'LocationCardActionBar',
  data () {
    return {
      observer: null,
      isFixed: false,
      width: 0
    }
  },
  mounted () {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(item => {
        const isTop = item.boundingClientRect.top - window.innerHeight + 60 > 0
        this.isFixed = !item.isIntersecting && !isTop
        this.width = this.$el.getBoundingClientRect().width - 2
      })
    }, {
    })

    this.observer.observe(this.$refs.line) // 开始监听child
  },
  beforeDestroy () {
    this.observer.disconnect()
  }
}
</script>

<style lang="scss">
  .location-list_action-bar {
    margin: 0 10px;
    position: relative;
    height: 40px;
    .el-card__body {
      padding: 0 20px;
      display: flex;
      .spring {
        flex: 1;
      }
    }
    .observe-detect-line {
      position: absolute;
      top: -10px;
      left: 0;
      width: 100%;
      height: 1px;
    }
    &.fixed {
      .fixed-card {
        position: fixed;
        top: 70px;
        z-index: 2;
      }
    }
  }
</style>
