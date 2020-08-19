<template>
  <li :class="['menu-item']">
    <div class="menu-item-label" @click="folderOpen = !folderOpen">
      <icon :type="folderOpen ? 'icon-folder-opened' : 'icon-folder'"></icon>
      <span>{{menuInfo.name}}</span>
      <el-button circle icon="el-icon-more" class="menu-item-more-icon" type="text" v-if="menuInfo.canModify"></el-button>
    </div>
    <ul class="sub-menu-list" v-show="folderOpen">
      <li :class="['sub-menu-item', {active: currentDraftId === child.id}]" v-for="child in menuInfo.children.filter(item => item)" :key="child.id" @click="onMenuItemClick(child.id)">
        <span>{{serverIdList[child.id].name}}</span>
        <el-button @click.stop circle icon="el-icon-more" class="menu-item-more-icon" type="text"></el-button>
      </li>
    </ul>
    <div class="menu-item-empty" v-show="folderOpen && !menuInfo.children.length">
      <icon type="icon-document-delete"></icon>
      <span>Empty</span>
    </div>
  </li>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'LeftMenuItem',
  props: {
    menuInfo: {
      type: Object,
      default: () => ({
        children: []
      })
    }
  },
  data () {
    return {
      folderOpen: false
    }
  },
  computed: {
    ...mapGetters({
      currentDraftId: 'getCurrentDraftId',
      serverIdList: 'getIdOrderedServerList'
    })
  },
  methods: {
    ...mapActions({
      setCurrentDraft: 'setCurrentDraft'
    }),
    onMenuItemClick (id) {
      this.setCurrentDraft(id)
      this.$router.push({
        name: 'server'
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/style/base.scss";
  $right-operation-whitespace: 50px;
  .menu-item {
    .menu-item-label {
      padding: $main-padding calc(#{$main-padding} / 5 * 3);
      border-radius: $main-border-radius;
      display: flex;
      align-items: center;
      overflow:hidden; //超出的文本隐藏
      text-overflow:ellipsis; //溢出用省略号显示
      white-space:nowrap; //溢出不换行
      position: relative;
      &:hover {
        padding: $main-padding $right-operation-whitespace $main-padding calc(#{$main-padding} / 5 * 3);
        background-color: darken($main-color, 5%);
        color: $main-white;
        .menu-item-more-icon {
          opacity: 1;
        }
      }
    }
    .common-icon {
      font-size: 24px;
      margin-right: 6px;
    }
    & + .menu-item {
    }
    &.active {
      .menu-item-label {
        background-color: darken($main-color, 5%);
        color: $main-white;
      }
    }
  }
  .sub-menu-list {
    padding: 0 0 0 $main-padding;
    margin-bottom: $main-padding;
    .sub-menu-item {
      padding: $main-padding/2;
      overflow:hidden; //超出的文本隐藏
      text-overflow:ellipsis; //溢出用省略号显示
      white-space:nowrap; //溢出不换行
      position: relative;
      &.active {
        color: $main-color;
      }
      &:hover {
        background-color: $main-color;
        color: $main-white;
        border-radius: $main-border-radius;
        padding: $main-padding/2 $right-operation-whitespace $main-padding/2 $main-padding/2;
        .menu-item-more-icon {
          opacity: 1;
        }
      }
      & + .sub-menu-item {
      }
    }
  }
  .menu-item-more-icon {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    color: $main-white!important;
    font-size: 22px!important;
    opacity: 0;
    transition: 0s all;
  }
  .menu-item-empty {
    text-align: center;
    color: $placeholder-text-color;
    margin-bottom: $main-padding;
    & > * {
      vertical-align: middle!important;
    }
  }
</style>
