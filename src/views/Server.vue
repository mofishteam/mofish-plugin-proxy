<template>
  <div class="server-view">
    <server-content :content.sync="draft" :key="draft.id" v-if="draft"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ServerContent from '@/components/ServerContent'
export default {
  name: 'ServerView',
  methods: {
    ...mapActions({
      modifyDraft: 'modifyDraft'
    })
  },
  computed: {
    ...mapGetters({
      currentDraft: 'getCurrentDraft'
    }),
    draft: {
      set (value) {
        this.modifyDraft(value)
      },
      get () {
        return this.currentDraft
      }
    }
  },
  components: {
    ServerContent
  }
}
</script>

<style lang="scss">
  @import "~@/assets/style/base.scss";
  .server-view {
    width: 100%;
  }
</style>
