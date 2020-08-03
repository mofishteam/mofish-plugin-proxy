<template>
  <div class="top-tab">
    <svg version="1.1" v-show="false" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <symbol id="chrome-tab-geometry-left" viewBox="0 0 214 36">
          <path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z"></path>
        </symbol>
        <symbol id="chrome-tab-geometry-right" viewBox="0 0 214 36">
          <use xlink:href="#chrome-tab-geometry-left"></use>
        </symbol>
        <clipPath id="crop">
          <rect class="mask" width="100%" height="100%" x="0"></rect>
        </clipPath>
      </defs>
    </svg>
    <div class="top-tab_wrap">
      <ul class="top-tab_list">
        <tab-item v-for="draft in draftList" :key="draft.id" :draft="draft" @click="setCurrentDraft(draft.id)"></tab-item>
        <li class="top-tab_add-btn" @click="addNewDraft()">
          <icon type="icon-plus"></icon>
        </li>
      </ul>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TabItem from './TabItem'
export default {
  name: 'TopTab',
  data () {
    return {
      active: 0
    }
  },
  computed: {
    ...mapGetters({
      draftList: 'getDraftList'
    })
  },
  methods: {
    ...mapActions({
      addNewDraft: 'addNewDraft',
      setCurrentDraft: 'setCurrentDraft'
    })
  },
  components: {
    TabItem
  }
}
</script>

<style lang="scss">
  @import "~@/assets/style/base.scss";
  $top-tab-height: 34px;
  .top-tab {
    flex: 1;
    /*-webkit-app-region: drag;*/
    background-color: $third-level-border-color;
    .top-tab_wrap {
    }
    .top-tab_list {
      height: $top-tab-height;
      padding: 8px 40px 4px 20px;
      display: flex;
    }
    .top-tab_add-btn {
      height: $top-tab-height;
      width: $top-tab-height;
      border-radius: 50%;
      background-color: rgba($main-white, 0);
      text-align: center;
      line-height: $top-tab-height;
      text-shadow: 0 0 2px rgba($main-text-color, 1);
      margin-left: $main-button-gap;
      transition: all .3s;
      &:hover {
        background-color: rgba($main-white, .6);
      }
      &:active {
        background-color: rgba($main-white, 1);
      }
    }
  }
</style>
