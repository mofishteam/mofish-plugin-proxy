<template>
  <el-container class="home-page">
    <el-aside width="240px">
      <el-menu default-active="homeServers" class="home-page-menu">
        <el-menu-item @click="addServer">Add Server</el-menu-item>
        <grid-layout @layout-updated="onLayoutUpdated" v-if="serverSortGridList && serverSortGridList.length" :margin="[0, 0]" :layout="serverSortGridList" :row-height="50" :col-num="1" :is-draggable="isSort" :is-resizable="false">
          <grid-item :key="server.id" v-for="server in servers" :x="serverSortGrid[server.id].x" :y="serverSortGrid[server.id].y" :w="serverSortGrid[server.id].w" :h="serverSortGrid[server.id].h" :i="serverSortGrid[server.id].i">
            <el-menu-item :index="`homeServers-${server.id}`" @click="setServer(server.id)" :class="{'is-sort': isSort}">
              <el-button v-show="!isSort" circle :type="closeList.includes(server.id) ? 'danger' : 'success'" size="mini" style="margin-right: 6px; transform: scale(.6);"></el-button>
              <el-button type="text" icon="el-icon-rank" v-show="isSort" style="margin-left: -9px;"></el-button>
              <span>{{ server.name }}</span>
            </el-menu-item>
          </grid-item>
        </grid-layout>
      </el-menu>
      <div class="sort-btn-wrap">
        <el-button type="primary" icon="el-icon-sort" @click="isSort = !isSort">{{isSort ? 'Stop Sort' : 'Sort'}}</el-button>
      </div>
    </el-aside>
    <el-main class="home-page-content" ref="mainContent">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { saveServerSortList } from '@/api/service/servers'
import VueGridLayout from 'vue-grid-layout'
export default {
  name: 'homePage',
  data () {
    return {
      isSort: false,
      serverSortGrid: [],
      serverSortGridList: [],
      mainContentLoadingObj: null
    }
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  methods: {
    ...mapActions([
      'refreshServers',
      'setCurrentServer',
      'clearCurrentServer',
      'refreshCloseList',
      'refreshServerSortList'
    ]),
    addServer () {
      if (!(this.isSort || this.$route.query.add)) {
        this.clearCurrentServer()
        this.$router.push({
          ...this.$route,
          query: {
            ...this.$route.query,
            add: true
          }
        })
      }
    },
    setServer (id) {
      this.$router.push({
        ...this.$route,
        query: {
          ...this.$route.query,
          add: false
        }
      })
      this.setCurrentServer(id)
    },
    resetSortGrid () {
      const result = {}
      let tempY = 0
      const serverIdList = this.servers.reduce((sum, cur, idx) => {
        if (cur && cur.id) {
          sum.push(cur.id)
        }
        return sum
      }, [])
      for (const id of this.serverSortList.concat(serverIdList)) {
        if (!result[id]) {
          result[id] = {
            x: 0,
            y: tempY++,
            h: 1,
            w: 1,
            i: id
          }
        }
      }
      this.$set(this, 'serverSortGrid', result)
    },
    resetSortList () {
      const result = []
      for (const item of Object.entries(this.serverSortGrid)) {
        result.push(item[1])
      }
      this.$set(this, 'serverSortGridList', result)
    },
    onLayoutUpdated (newLayout) {
    }
  },
  watch: {
    isSort (val) {
      if (val) {
        this.mainContentLoadingObj = this.$loading.service({
          target: this.$refs.mainContent.$el,
          text: 'Menu sort is NOT saved, please save sort first.',
          spinner: 'el-icon-lock'
        })
      } else {
        if (this.mainContentLoadingObj) {
          this.mainContentLoadingObj.close()
        }
        const sortList = []
        if (this.serverSortGridList && this.serverSortGridList.length) {
          for (const item of this.serverSortGridList) {
            if (item.i) {
              sortList[item.y] = item.i
            }
          }
        }
        saveServerSortList({
          list: sortList
        }).then(res => {
          this.refreshServerSortList()
        })
      }
    },
    serverSortList: {
      deep: true,
      handler (val) {
        this.resetSortGrid()
        this.resetSortList()
      }
    }
  },
  async created () {
    this.refreshCloseList()
    await this.refreshServers()
    this.refreshServerSortList()
  },
  computed: {
    ...mapGetters({
      servers: 'getServers',
      closeList: 'getCloseList',
      serverSortList: 'getServerSortList'
    })
  }
}
</script>

<style lang="scss">
  .home-page {
    .el-aside {
      position: relative;
      .sort-btn-wrap {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        .el-button {
          border-radius: 0;
          width: 100%;
        }
      }
    }
    .home-page-content {
      width: 100%;
      height: 100vh;
      overflow: scroll;
    }
    &-content {
      padding: 20px;
    }
    &-menu {
      height: calc(100vh - 40px);
      padding-bottom: 40px;
      overflow: scroll;
      .vue-grid-layout {
      }
      .is-sort {
        cursor: move;
        user-select: none;
        pointer-events: none;
      }
    }
  }
</style>
