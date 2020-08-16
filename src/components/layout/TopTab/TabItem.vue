<template>
  <li :class="['top-tab-item', { active }]" @mousedown="$emit('click', $event)" v-if="draft">
    <svg class="top-tab-item_background">
      <g>
        <svg width="52%" height="100%">
          <use xlink:href="#chrome-tab-geometry-left" width="214" height="36" class="chrome-tab-geometry"></use>
        </svg>
      </g>
      <g transform="scale(-1, 1)">
        <svg width="52%" height="100%" x="-100%" y="0">
          <use xlink:href="#chrome-tab-geometry-right" width="214" height="36"
               class="chrome-tab-geometry"></use>
        </svg>
      </g>
    </svg>
    <span class="top-tab-item_title overflow-gradient-text">
      <span class="modified-icon text-danger" v-show="modified">*</span>
      <span>{{ idOrderedServerList[draft.id] ? idOrderedServerList[draft.id].name : 'New Tab' }}</span>
    </span>
    <div class="top-tab-item_close-btn" @click="deleteDraft(draft.id)">
      <icon type="icon-close"></icon>
    </div>
  </li>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'TopItem',
  props: {
    draft: {
      type: Object,
      default: null
    },
    modified: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      currentDraftId: 'getCurrentDraftId',
      idOrderedServerList: 'getIdOrderedServerList'
    }),
    active () {
      return this.draft && (this.draft.id === this.currentDraftId)
    }
  },
  methods: {
    ...mapActions({
      deleteDraft: 'deleteDraft'
    })
  }
}
</script>

<style lang="scss">
  @import "~@/assets/style/base.scss";
  .top-tab-item {
    position: relative;
    flex: 1;
    justify-content: center;
    max-width: 200px;
    min-width: 40px;
    &:not(.active):not(:hover) + .top-tab-item:not(.active):not(:hover) {
      &:before {
        content: '';
        position: absolute;
        top: 6px;
        bottom: 6px;
        left: 0;
        width: 1px;
        background-color: $first-level-border-color;
      }
    }
    &_title {
      position: absolute;
      top: 50%;
      left: 20px;
      right: 30px;
      transform: translateY(-50%);
      font-size: 12px;
      pointer-events: none;
      display: flex;
      align-items: center;
      .modified-icon {
        font-size: 14px;
        margin-right: 4px;
      }
    }
    &_close-btn {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      font-weight: bold;
      font-size: 12px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background-color: $first-level-border-color;
      }
    }
    &_background {
      fill: $main-white;
      opacity: 0;
      transition: all .3s;
      height: 100%;
      position: absolute;
      top: 0;
      left: -9px;
      width: calc(100% + 19px);
      pointer-events: none;
    }
    &:hover {
      .top-tab-item_background {
        opacity: .6;
      }
    }
    &.active {
      z-index: 2;
      .top-tab-item_background {
        opacity: 1;
      }
    }
  }
</style>
