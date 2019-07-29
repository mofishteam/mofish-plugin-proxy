<template>
  <el-container class="home-page">
    <el-aside width="200px">
      <el-menu default-active="homeServers" class="home-page-menu">
        <el-menu-item :index="`homeServers-${server.id}`" :key="server.id" @click="setCurrentServer(server.id)" v-for="server in servers">{{ server.name }}</el-menu-item>
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
      'setCurrentServer'
    ])
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
