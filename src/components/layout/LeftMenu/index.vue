<template>
  <div class="left-menu" :style="{width: width + 'px'}">
    <div class="operation-group">
      <el-tooltip content="Add Folder">
        <el-button type="text" icon="el-icon-folder-add"></el-button>
      </el-tooltip>
      <el-tooltip content="Add Proxy">
        <el-button type="text" icon="el-icon-document-add"></el-button>
      </el-tooltip>
    </div>
    <div class="menu-main">
      <menu-list :menus="menus"></menu-list>
    </div>
  </div>
</template>

<script>
import MenuList from './MenuList'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'LeftMenu',
  data () {
    return {
      width: 300
    }
  },
  methods: {
    ...mapActions({
      refreshMenu: 'refreshMenu',
      setMenu: 'setMenu'
    })
  },
  created () {
    this.refreshMenu()
  },
  computed: {
    ...mapGetters({
      menuList: 'getMenu',
      menuServers: 'getMenuServers',
      serverList: 'getServerList'
    }),
    menus: {
      set (value) {
        this.setMenu(value || [])
      },
      get () {
        const result = this.menuList
        console.log(result)
        // 找到没有被分配的Default文件夹
        const defaultMenu = result.find(item => item.name === 'Default')
        if (defaultMenu) {
          // 从ServerList中找到没有被分配文件夹的Server
          const defaultServers = this.serverList.reduce((sum, cur) => {
            if (!this.menuServers.includes(cur.id)) {
              sum.push({ id: cur.id })
            }
            return sum
          }, [])
          defaultMenu.children.push(...defaultServers)
          return result
        } else {
          return []
        }
      }
    }
  },
  components: {
    MenuList
  }
}
</script>

<style lang="scss">
  @import "~@/assets/style/base.scss";
  .left-menu {
    height: 100vh;
    -ms-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    -webkit-app-region: drag;
    border-right: 1px solid $forth-level-border-color;
    .operation-group {
      padding-right: $main-padding;
      height: $title-bar-height;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-button {
        font-size: 22px;
        & + .el-button {
          margin-left: 16px;
        }
      }
    }
    .menu-main {
      overflow: scroll;
      padding: 0 $main-padding $main-padding;
      height: calc(100% - #{$title-bar-height} - #{$main-padding} * 2);
    }
  }
</style>
