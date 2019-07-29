<template>
  <div class="server-content-page">
    {{ currentServer }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { clone } from 'lodash'
export default {
  name: 'ServerContentPage',
  data () {
    return {
      currentServer: {}
    }
  },
  computed: {
    ...mapGetters({
      getCurrentServer: 'getCurrentServer'
    })
  },
  watch: {
    getCurrentServer (val) {
      this.currentServer = clone(val)
    }
  }
}
</script>

<style lang="scss"></style>
