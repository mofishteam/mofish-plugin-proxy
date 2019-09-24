<template>
  <el-tabs type="card" editable @edit="handleTabsEdit">
    <el-tab-pane v-for="item in currentServerDraft.tabList" :label="(currentServerDraft.draftList[item] || {}).name" :name="item" :key="item">
      <server-content-item :server="serverIdMap[item]" :is-add="currentServerIsAdd"></server-content-item>
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
      servers: 'getServers',
      getCurrentServer: 'getCurrentServer',
      currentServerIsAdd: 'getCurrentServerIsAdd',
      currentServerDraft: 'getCurrentServerDraft'
    }),
    serverIdMap () {
      const result = {}
      for (const item of this.servers) {
        result[item.id] = item
      }
      return result
    }
  },
  created () {
  },
  methods: {
    handleTabsEdit (targetName, action) {
      if (action === 'add') {} else if (action === 'remove') {}
    }
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
