<template>
  <el-container class="home-page">
    <el-aside width="200px">
      <el-menu default-active="homeServers" class="home-page-menu">
        <el-menu-item @click="addServer">Add Server</el-menu-item>
        <el-menu-item :index="`homeServers-${server.id}`" :key="server.id" @click="setServer(server.id)" v-for="server in servers">{{ server.name }}</el-menu-item>
      </el-menu>
    </el-aside>
    <el-main class="home-page-content">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'homePage',
  components: {
  },
  methods: {
    ...mapActions([
      'refreshServers',
      'setCurrentServer',
      'clearCurrentServer'
    ]),
    addServer () {
      this.clearCurrentServer()
      this.$router.push({
        ...this.$route,
        query: {
          ...this.$route.query,
          add: true
        }
      })
    },
    setServer (id) {
      this.$router.push({
        ...this.$route,
        query: {
          ...this.$route.query,
          add: false
        }
      })
      this.setCurrentServer(id)
    }
  },
  created () {
    this.refreshServers()
  },
  computed: {
    ...mapGetters({
      servers: 'getServers'
    })
  }
}
</script>

<style lang="scss">
  .home-page {
    &-content {
      padding: 20px;
    }
    &-menu {
      height: 100vh;
    }
  }
</style>
