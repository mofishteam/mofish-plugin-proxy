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
export default {
  name: 'LeftMenu',
  data () {
    return {
      width: 300,
      menus: [{
        name: 'Recently',
        id: '12312334',
        isFolder: true,
        canRename: false,
        children: [{
          id: '1234353456',
          name: 'ABC ABCA BABDSBA',
          isFolder: false,
          canRename: true
        }, {
          id: '124346567234',
          name: 'ABC ABCA BABDSBA',
          isFolder: false,
          canRename: true
        }, {
          id: '23434k5345',
          name: 'ABC ABCA BABDSBA',
          isFolder: false,
          canRename: true
        }, {
          id: '234,m234,mn234',
          name: 'ABC ABCA BABDSBA',
          isFolder: false,
          canRename: true
        }]
      }, {
        id: '234,m234n',
        name: 'Default',
        isFolder: true,
        canRename: false,
        children: [{
          id: '23,4234n5bn46',
          name: 'ABC ABCA BABDSBA',
          isFolder: false,
          canRename: true
        }, {
          id: '234m45n34b563',
          name: 'ABC ABCA BABDSBASDFSDFSDFSDFSDF',
          isFolder: false,
          canRename: true
        }]
      }]
    }
  },
  methods: {},
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
