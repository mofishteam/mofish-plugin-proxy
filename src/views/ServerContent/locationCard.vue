<template>
  <el-card class="location-card" shadow="hover">
    <div class="location-card_title">
      <i class="el-icon-arrow-right text-secondary-black"></i>
      <span class="location-card_url">{{location.url}}</span>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'LocationCard',
  props: {
    locationId: {
      default: '',
      type: String
    },
    currentServer: {
      default: () => ({
        server: {}
      }),
      type: Object
    }
  },
  data () {
    return {
    }
  },
  computed: {
    location () {
      console.log(this.currentServer)
      return this.currentServer.server.locations.find((item) => {
        return item.id === this.locationId
      })
    }
  }
}
</script>

<style lang="scss">
  .location-card {
    height: 90px;
    .el-card__body {
      padding-top: 5px;
      padding-bottom: 0;
    }
    &_title {

    }
    &_url {
      margin-left: 15px;
      display: inline-block;
      font-weight: bold;
    }
  }
</style>
