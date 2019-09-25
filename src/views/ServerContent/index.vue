<template>
  <section :class="['server-content-page', {'is-empty': !currentServerDraft.tabList.length}]">
    <el-tabs type="card" editable @edit="handleTabsEdit" v-model="currentServerId" stretch addable closable v-show="currentServerDraft.tabList.length">
      <el-tab-pane v-for="item in currentServerDraft.tabList" :name="item.id" :key="item.id">
        <el-badge is-dot slot="label" style="display: inline;" :hidden="!draftEditedList.includes(item.id)">
        <span>
          {{(serverIdMap[item.id] || {}).name || 'New Tab'}}
        </span>
        </el-badge>
        <server-content-item :server="serverIdMap[item.id] || currentServerDraft.draftList[item.id]" :is-add="!serverIdMap[item.id]"></server-content-item>
      </el-tab-pane>
    </el-tabs>
    <div class="empty" v-show="!currentServerDraft.tabList.length">
      <p class="text-secondary-black" style="font-size: 40px;">Mofish Proxy</p>
      <div style="margin-top: 30px;">
        <el-button plain size="large" @click="addTempServer">Add Server</el-button>
      </div>
    </div>
  </section>
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
      draftEditedList: 'getDraftEditedList',
      currentServerDraftList: 'getCurrentServerDraftList'
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
      'addTempServer'
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
  .server-content-page {
    position: relative;
    &:not(.is-empty) {
      &:before, &:after {
        content: '';
        position: absolute;
        top: 40px;
        height: 1px;
        background-color: #e4e7ed;
        width: 20px;
      }
      &:before {
        left: 0;
        transform: translateX(-100%);
      }
      &:after {
        right: 0;
        transform: translateX(100%);
      }
    }
    .empty {
      position: relative;
      text-align: center;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
