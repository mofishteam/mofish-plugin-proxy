<template>
  <section class="server-content-page">
    <el-card shadow="hover" class="server-content-page__container" v-if="$route.query.add || currentServer.name">
      <div slot="header" class="clearfix">
        <span>{{ currentServer.name }}</span>
        <el-button type="text" icon="el-icon-edit-outline" style="margin-left: 5px;"></el-button>
        <el-button style="float: right;" type="danger" icon="el-icon-delete" circle :disabled="$route.query.add"></el-button>
      </div>
      <el-form ref="form" :model="currentServer" label-width="100px">
        <el-form-item label="ServerName">
          <el-select
            v-model="currentServer.server.name"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Input server name and press enter to add."
            style="width: 100%; max-width: 500px;">
            <el-option label="localhost" value="localhost"></el-option>
            <el-option label="127.0.0.1" value="127.0.0.1"></el-option>
            <el-option label="0.0.0.0" value="0.0.0.0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Listen">
          <el-input v-model="currentServer.server.listen" placeholder="Input port for server to listen." style="width: 100%; max-width: 500px;"></el-input>
        </el-form-item>
        <el-form-item label="Locations">
          <el-row :gutter="20">
            <el-col :span="10">
              <location-card v-for="(location, $locationIndex) in currentServer.server.locations" :location="location" :key="$locationIndex"></location-card>
            </el-col>
            <el-col :span="10">
              <location-card :is-add="true" :location="currentLocation" v-if="currentLocation"></location-card>
            </el-col>
            <el-col :span="24" class="tac" style="margin-top: 20px;">
              <el-button icon="el-icon-plus" @click="addLocation">Add Location</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="server-content-page__empty text-placeholder" v-if="!$route.query.add && !currentServer.name">
      Click 'Add Server' button or chose a server
    </div>
  </section>
</template>

<script>
import { defaultServerOption, defaultLocationOption } from '../../../commonUtils/options'
import LocationCard from './locationCard'
import { mapGetters } from 'vuex'
import { clone } from 'lodash'
export default {
  name: 'ServerContentPage',
  data () {
    return {
      currentServer: {},
      currentLocation: null
    }
  },
  computed: {
    ...mapGetters({
      getCurrentServer: 'getCurrentServer'
    })
  },
  created () {
    if (this.$route.query.add) {
      this.currentServer = defaultServerOption()
    }
  },
  methods: {
    addLocation () {
      this.currentLocation = defaultLocationOption()
    }
  },
  watch: {
    getCurrentServer (val) {
      this.currentServer = clone(val)
    },
    $route (val) {
      if (val.query.add) {
        this.currentServer = defaultServerOption()
      }
    }
  },
  components: {
    LocationCard
  }
}
</script>

<style lang="scss">
  .server-content-page {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: scroll;
    .server-content-page__empty {
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      text-align: center;
      transform: translateY(-50%);
      font-size: 24px;
    }
  }
</style>
