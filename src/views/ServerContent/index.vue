<template>
  <server-content-item :server="getCurrentServer" :is-add="currentServerIsAdd"></server-content-item>
</template>

<script>
import ServerContentItem from './serverContentItem'
import { mapGetters } from 'vuex'
export default {
  name: 'ServerContentPage',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      getCurrentServer: 'getCurrentServer',
      currentServerIsAdd: 'getCurrentServerIsAdd'
    })
  },
  created () {
  },
  methods: {
  },
  watch: {
  },
  components: {
    ServerContentItem
  }
}
</script>

<style lang="scss">
</style>
