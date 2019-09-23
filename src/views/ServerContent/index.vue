<template>
  <el-tabs>
    <el-tab-pane>
      <server-content-item :server="getCurrentServer" :is-add="currentServerIsAdd"></server-content-item>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ServerContentItem from './serverContentItem'
import { mapGetters } from 'vuex'
export default {
  name: 'ServerContentPage',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      getCurrentServer: 'getCurrentServer',
      currentServerIsAdd: 'getCurrentServerIsAdd'
    })
  },
  created () {
  },
  methods: {
  },
  watch: {
  },
  components: {
    ServerContentItem
  }
}
</script>

<style lang="scss">
</style>
