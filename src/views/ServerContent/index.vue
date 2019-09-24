<template>
  <el-tabs type="card" editable @edit="handleTabsEdit" v-model="currentServerId">
    <el-tab-pane v-for="item in currentServerDraft.tabList" :name="item.id" :key="item.id">
      <el-badge is-dot slot="label" style="display: inline;" :hidden="!draftEditedList.includes(item.id)">
        <span>
          {{(serverIdMap[item.id] || {}).name || 'New Tab'}}
        </span>
      </el-badge>
      <server-content-item :server="serverIdMap[item.id] || currentServerDraft.draftList[item.id]" :is-add="!serverIdMap[item.id]" @edited="setDraftEdited(item.id)"></server-content-item>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ServerContentItem from './serverContentItem'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ServerContentPage',
  data () {
    return {
      currentServerId: this.getCurrentServer
    }
  },
  computed: {
    ...mapGetters({
      servers: 'getServers',
      getCurrentServer: 'getCurrentServer',
      currentServerIsAdd: 'getCurrentServerIsAdd',
      currentServerDraft: 'getCurrentServerDraft',
      draftEditedList: 'getDraftEditedList'
    }),
    serverIdMap () {
      const result = {}
      for (const item of this.servers) {
        result[item.id] = item
      }
      console.log(result)
      return result
    }
  },
  created () {
  },
  methods: {
    ...mapActions([
      'setActiveServer',
      'removeDraft',
      'addTempServer',
      'setDraftEdited'
    ]),
    handleTabsEdit (targetName, action) {
      if (action === 'add') {
        this.addTempServer()
      } else if (action === 'remove') {
        this.removeDraft(targetName)
      }
    }
  },
  watch: {
    getCurrentServer (val) {
      this.currentServerId = val
    },
    currentServerId (id) {
      this.setActiveServer(id)
    }
  },
  components: {
    ServerContentItem
  }
}
</script>

<style lang="scss">
</style>
