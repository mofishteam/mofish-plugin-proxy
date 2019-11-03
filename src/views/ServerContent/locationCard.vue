<template>
  <el-card class="location-card" shadow="hover">
    <div class="location-card_title">
      <i class="el-icon-arrow-right text-secondary-black"></i>
      <span class="location-card_url">{{location.url}}</span>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'LocationCard',
  props: {
    locationId: {
      default: '',
      type: String
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      locationMap: 'getLocationMap',
      currentServer: 'getCurrentServer'
    }),
    location () {
      return this.locationMap[this.currentServer][this.locationId]
    }
  }
}
</script>

<style lang="scss">
  .location-card {
    &_title {

    }
    &_url {
      margin-left: 15px;
      display: inline-block;
      font-weight: bold;
    }
  }
</style>
