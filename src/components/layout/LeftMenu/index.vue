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
      menuList: 'getMenu'
    }),
    menus: {
      set (value) {
        this.setMenu(value || [])
      },
      get () {
        return this.menuList
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
