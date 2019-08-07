<template>
  <el-container class="home-page">
    <el-aside width="200px">
      <el-menu default-active="homeServers" class="home-page-menu">
        <el-menu-item @click="addServer">Add Server</el-menu-item>
        <el-menu-item :index="`homeServers-${server.id}`" :key="server.id" @click="setServer(server.id)" v-for="server in servers">
          <el-button circle :type="closeList.includes(server.id) ? 'danger' : 'success'" size="mini" style="margin-right: 6px; transform: scale(.6);"></el-button>
          <span>{{ server.name }}</span>
        </el-menu-item>
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
      'clearCurrentServer',
      'refreshCloseList'
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
    this.refreshCloseList()
    this.refreshServers()
  },
  computed: {
    ...mapGetters({
      servers: 'getServers',
      closeList: 'getCloseList'
    })
  }
}
</script>

<style lang="scss">
  .home-page {
    .home-page-content {
      width: 100%;
      height: 100vh;
      overflow: scroll;
    }
    &-content {
      padding: 20px;
    }
    &-menu {
      height: 100vh;
    }
  }
</style>
