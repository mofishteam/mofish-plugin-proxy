<template>
  <el-container class="home-page">
    <el-aside width="240px">
      <el-menu :default-active="`homeServers-${currentServer}`" class="home-page-menu">
        <el-row>
<!--          <el-col :span="12">-->
<!--            <el-button class="rect-button" type="text" icon="el-icon-plus" @click="addServer" style="width: 100%;">Server</el-button>-->
<!--          </el-col>-->
          <el-col :span="24">
            <el-button class="rect-button no-border-button" type="primary" plain icon="el-icon-folder-add" @click="addFolder" style="width: 100%;">Folder</el-button>
          </el-col>
        </el-row>
        <div class="home-page_scroll-view">
          <div class="add-folder-wrap">
            <el-menu-item index="addFolder" class="add-folder-item" v-if="showAddFolder">
              <i class="el-icon-folder"></i>
              <el-input ref="addFolderInput" size="mini" @keyup.enter.native="addFolderConfirm" @blur="addFolderConfirm" v-model="addFolderLabel"></el-input>
              <i class="el-icon-close" style="margin-right: -15px;"></i>
            </el-menu-item>
          </div>
          <el-tree :default-expanded-keys="expandedList" @node-expand="nodeExpand" @node-collapse="nodeCollapse" @node-contextmenu="showTreeItemContextMenu" empty-text="No Servers." :indent="8" :data="computedServerSortList" node-key="id" :draggable="true" @node-drop="menuDropEnd" :allow-drop="allowDrop">
            <div slot-scope="{ node, data }" :class="['menu-wrap', {'is-dir': data.isDir}]">
              <div v-if="data.isDir" :class="['menu-folder-item', {hover: node.showMenu}]">
                <i v-if="!(data.children && data.children.length)" class="el-icon-folder-remove"></i>
                <template v-else>
                  <i v-if="node.expanded" class="el-icon-folder-opened"></i>
                  <i v-if="!node.expanded" class="el-icon-folder"></i>
                </template>
                <span style="margin-left: 4px;">{{node.label}}</span>
                <el-dropdown
                  placement="bottom-end"
                  @visible-change="menuVisibleChange(node, $event)"
                  trigger="click"
                  class="more-button"
                  :ref="`menu-folder-popover-${data.id}`">
                  <el-button :ref="`menu-item-popover-button-${data.id}`" class="more-button-display" icon="el-icon-more" type="text" @click.stop style="padding: 0;"></el-button>
                  <el-dropdown-menu slot="dropdown" class="menu-folder-popover-dropdown" :key="`menu-folder-popover-${data.id}`">
                    <el-dropdown-item icon="el-icon-delete" class="text-danger" @click.native="deleteFolderConfirm(data.id)">
                      Delete
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <template v-if="!data.isDir">
                <el-menu-item :class="[{hover: node.showMenu}]" :index="`homeServers-${server.id}`" @click="setServer(server.id)" :key="server.id" v-for="server in getServerItem(data.id)">
                  <el-button circle :type="closeList.includes(server.id) ? 'danger' : 'success'" size="mini" style="margin-right: 6px; transform: scale(.6);"></el-button>
                  <span class="menu-label">
                  <span class="text-danger" v-show="draftEditedList.includes(server.id)" style="margin-right: 4px;">*</span>
                  <span>{{ server.name }}</span>
                </span>
                  <el-dropdown
                    placement="bottom-end"
                    @visible-change="menuVisibleChange(node, $event)"
                    trigger="click"
                    class="more-button"
                    :ref="`menu-popover-${data.id}`">
                    <el-button :ref="`menu-item-popover-button-${data.id}`" class="more-button-display" icon="el-icon-more" type="text" @click.stop style="padding: 0;"></el-button>
                    <el-dropdown-menu slot="dropdown" :key="`menu-popover-${data.id}`">
                      <el-dropdown-item icon="el-icon-delete" class="text-danger" @click.native="deleteServerConfirm(server.id)">
                        Delete
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-menu-item>
              </template>
            </div>
          </el-tree>
        </div>
      </el-menu>
    </el-aside>
    <el-main class="home-page-content" ref="mainContent">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { saveServerSortList } from '@/api/service/servers'
import md5 from 'md5'
let folderIdCnt = 0
export default {
  name: 'homePage',
  data () {
    return {
      serverSortGrid: [],
      serverSortGridList: [],
      mainContentLoadingObj: null,
      addFolderLabel: '',
      computedServerSortList: [],
      showAddFolder: false,
      expandedList: []
    }
  },
  components: {
  },
  methods: {
    ...mapActions([
      'refreshServers',
      'setActiveServer',
      'clearCurrentServer',
      'refreshCloseList',
      'refreshServerSortList',
      'prependServerSort',
      'deleteServerConfirm',
      'deleteFolderConfirm',
      'setCurrentServerIsAdd',
      'addTempServer'
    ]),
    getFolderId () {
      return md5(`folder-${folderIdCnt++}-${new Date().valueOf()}`)
    },
    menuDropEnd () {
      saveServerSortList({
        list: this.computedServerSortList
      }).then(async res => {
        await this.refreshServerSortList()
      })
    },
    allowDrop (draggingNode, dropNode, type) {
      return !(type === 'inner' && !dropNode.data.isDir)
    },
    addServer () {
      if (!this.currentServerIsAdd) {
        this.clearCurrentServer()
        this.addTempServer()
      }
    },
    addFolder () {
      this.addFolderLabel = ''
      this.showAddFolder = true
      this.$nextTick(() => {
        this.$refs.addFolderInput.focus()
      })
    },
    addFolderConfirm () {
      if (this.addFolderLabel) {
        this.prependServerSort({
          id: this.getFolderId(),
          isDir: true,
          children: [],
          label: this.addFolderLabel
        }).then(res => {
          this.showAddFolder = false
          this.addFolderLabel = ''
        })
      } else {
        this.showAddFolder = false
      }
    },
    getServerItem (id) {
      return [
        this.servers.find(item => {
          return item.id === id
        })
      ].filter(item => item)
    },
    setServer (id) {
      this.setActiveServer(id)
    },
    resetSortList () {
      const idList = new Set()
      const rawList = this.serverSortList
      const expandedList = []
      const traverseId = (item) => {
        if (item) {
          idList.add(item.id)
          if (item.isDir) {
            if (item.expanded) {
              expandedList.push(item.id)
            }
            for (const subItem of item.children || []) {
              traverseId(subItem)
            }
          }
        }
      }
      rawList.forEach(item => {
        traverseId(item)
      })
      for (const server of this.servers) {
        if (!idList.has(server.id)) {
          rawList.push({
            id: server.id,
            label: server.name,
            isDir: false
          })
        }
      }
      this.computedServerSortList = rawList
      this.expandedList = expandedList
    },
    menuVisibleChange (d, evt) {
      this.$set(d, 'showMenu', evt)
    },
    nodeExpand (data) {
      data.expanded = true
      setTimeout(() => {
        saveServerSortList({
          list: this.computedServerSortList
        }).then(async res => {
          // await this.refreshServerSortList()
        })
      }, 300)
    },
    nodeCollapse (data) {
      data.expanded = false
      setTimeout(() => {
        saveServerSortList({
          list: this.computedServerSortList
        }).then(async res => {
          // await this.refreshServerSortList()
        })
      }, 300)
    },
    showTreeItemContextMenu (event, dataItem, node, component) {
    }
  },
  watch: {
    serverSortList () {
      this.resetSortList()
    }
  },
  async created () {
    this.refreshCloseList()
    await this.refreshServers()
    await this.refreshServerSortList()
  },
  computed: {
    ...mapGetters({
      servers: 'getServers',
      closeList: 'getCloseList',
      serverSortList: 'getServerSortList',
      draftEditedList: 'getDraftEditedList',
      currentServerIsAdd: 'getCurrentServerIsAdd',
      currentServer: 'getCurrentServer'
    })
  }
}
</script>

<style lang="scss">
  @import "~@/assets/style/base.scss";
  .menu-folder-popover-dropdown {
    transform: translateX(8px);
  }
  .home-page {
    .home-page_scroll-view {
      height: calc(100% - 40px);
      overflow: scroll;
    }
    .el-menu-item {
      position: relative;
      &:before {
        /*content: '';*/
        transition: all .3s;
        position: absolute;
        background-color: transparent;
        width: 4px;
        height: calc(100% - 6px);
        top: 50%;
        right: 215px;
        transform: translateY(-50%);
      }
      &.is-active {
        font-weight: bold;
        &:before {
          background-color: $main-color;
        }
      }
    }
    .menu-label {
      display: inline-block;
      overflow: hidden;
      width: 188px;
      text-overflow:ellipsis;
      white-space:nowrap;
    }
    .menu-wrap {
      width: 100%;
      margin-left: -4px;
      &.is-dir {
        height: 100%;
        line-height: 50px;
      }
      .more-button-display {
        &:after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
      }
      .more-button {
        position: absolute;
        right: -15px;
        top: 16px;
        height: 26px;
        pointer-events: none;
        display: flex;
        opacity: 0;
        transition: .3s opacity;
        & > button.el-button > i.el-icon-more {
          color: $main-text-color;
        }
      }
      .el-menu-item {
        margin-left: -20px;
      }
      .menu-folder-item {
        position: relative;
        .more-button {
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .el-menu-item, .menu-folder-item {
        width: 100%;
        &:hover, &:active, &.is-active {
          background-color: transparent;
        }
        &:hover, &.hover {
          .menu-label {
            width: 170px;
          }
          .more-button {
            opacity: 1;
            pointer-events: auto;
          }
        }
      }
    }
    .add-folder-wrap {
      margin-left: -16px;
    }
    .el-tree-node__content {
      height: 50px;
      .el-icon-caret-right:before {
        display: none;
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
    &-content {
      padding: 20px 20px 0 20px;
      width: 100%;
      height: 100vh;
      min-width: 600px;
      overflow: scroll;
    }
    &-menu {
      height: 100vh;
      overflow: scroll;
      .vue-grid-layout {
      }
      .is-sort {
        cursor: move;
        user-select: none;
        pointer-events: none;
      }
    }
    .add-folder-item {
      display: flex;
      height: 50px;
      align-items: center;
      & > i {
        line-height: 50px;
      }
      .el-input {
        flex: 1;
      }
    }
  }
</style>
