<template>
  <el-container class="home-page">
    <el-aside width="240px">
      <el-menu default-active="homeServers" class="home-page-menu">
        <el-row>
          <el-col :span="12">
            <el-button class="rect-button" type="text" icon="el-icon-plus" @click="addServer" style="width: 100%;">Server</el-button>
          </el-col>
          <el-col :span="12">
            <el-button class="rect-button" type="text" icon="el-icon-folder-add" @click="addFolder" style="width: 100%;">Folder</el-button>
          </el-col>
        </el-row>
        <el-tree :data="computedServerSortList" node-key="id" :draggable="isSort">
          <div slot-scope="{ node, data }" class="tree-menu-wrap">
            <span v-if="data.isDir">
              <i class="el-icon-folder"></i>
              <span>{{node.label}}</span>
            </span>
            <template v-if="!data.isDir">
              <el-menu-item :index="`homeServers-${server.id}`" @click="setServer(server.id)" :key="server.id" v-for="server in getServerItem(data.id)">
                <el-button v-show="!isSort" circle :type="closeList.includes(server.id) ? 'danger' : 'success'" size="mini" style="margin-right: 6px; transform: scale(.6);"></el-button>
                <el-button type="text" icon="el-icon-rank" v-show="isSort" style="margin-left: -9px;"></el-button>
                <span>{{ server.name }}</span>
              </el-menu-item>
            </template>
          </div>
        </el-tree>
      </el-menu>
      <div class="sort-btn-wrap">
        <el-button class="rect-button" type="primary" icon="el-icon-sort" @click="isSort = !isSort">{{isSort ? 'Stop Sort' : 'Sort'}}</el-button>
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
    addFolder () {},
    getServerItem (id) {
      return [
        this.servers.find(item => {
          return item.id === id
        })
      ]
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
    }),
    computedServerSortList () {
      const rawList = this.serverSortList.concat(this.servers)
      const idList = new Set()
      const sortList = []
      rawList.forEach(item => {
        if (typeof item === 'object') {
          if (item.id && !idList.has(item.id)) {
            idList.add(item.id)
            sortList.push({
              id: item.id,
              label: '123',
              isDir: item.isDir
            })
          }
        } else if (!idList.has(item)) {
          idList.add(item)
          sortList.push({
            id: item,
            label: '345',
            isDir: false
          })
        }
      })
      console.log(sortList)
      return sortList
    }
  }
}
</script>

<style lang="scss">
  .home-page {
    .el-tree-node__content {
      height: 50px;
      .tree-menu-wrap {
        width: 100%;
        .el-menu-item {
          width: 100%;
          &:hover, &:active, &.is-active {
            background-color: transparent;
          }
        }
      }
    }
    .el-aside {
      position: relative;
      .sort-btn-wrap {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        .el-button {
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
