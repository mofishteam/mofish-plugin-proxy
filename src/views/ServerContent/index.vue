<template>
  <section class="server-content-page">
    <el-card shadow="hover" class="server-content-page__container" v-if="isAdd || currentServer.name" :key="'server-' + currentServer.id">
      <div slot="header" class="clearfix">
        <span v-show="!isEdit">{{ currentServer.name }}</span>
        <el-input v-show="isEdit" v-model="tempServerName" style="width: 100%; max-width: 300px;" @keyup.enter.native="switchEdit"></el-input>
        <el-button type="text" :icon="!isEdit ? 'el-icon-edit-outline' : 'el-icon-check'" style="margin-left: 5px;" @click="switchEdit"></el-button>
        <el-button v-show="isEdit" type="text" icon="el-icon-close" style="margin-left: 5px;" @click="isEdit = false"></el-button>
        <el-button style="float: right;" type="danger" icon="el-icon-delete" circle :disabled="isAdd" @click="deleteServerConfirm"></el-button>
        <el-button style="float: right;" :type="closeList.includes(currentServer.id) ? 'danger' : 'success'" icon="el-icon-switch-button" circle :disabled="isAdd" @click="switchServerStatus"></el-button>
        <el-radio-group style="float: right; vertical-align: middle;" v-model="displayMode">
          <el-radio-button label="visual">
            <i class="el-icon-turn-off"></i>
          </el-radio-button>
          <el-radio-button label="code">
            <i class="el-icon-tickets"></i>
          </el-radio-button>
        </el-radio-group>
      </div>
      <el-form ref="form" :model="currentServer" :label-width="displayMode === 'visual' ? '100px' : '0px'" style="max-width: 800px;">
        <template v-if="displayMode === 'visual'">
          <el-form-item label="ServerName">
            <el-input v-model="currentServer.server.name[0]" placeholder="Input server name and press enter to add."></el-input>
          </el-form-item>
          <el-form-item label="SSL">
            <el-switch v-model="currentServer.server.ssl"></el-switch>
          </el-form-item>
          <template v-if="currentServer.server.ssl && currentServer.server.sslOptions">
            <el-form-item label="Key">
              <el-input v-model="currentServer.server.sslOptions.key"></el-input>
            </el-form-item>
            <el-form-item label="Cert">
              <el-input v-model="currentServer.server.sslOptions.cert"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="Listen">
            <el-input v-model="currentServer.server.listen" placeholder="Input port for server to listen." style="width: 100%; max-width: 500px;">
              <port-test :current-id="currentServer.id" v-if="currentServer.server.listen" slot="append" :port="currentServer.server.listen"></port-test>
            </el-input>
          </el-form-item>
          <el-form-item label="Locations">
            <el-collapse v-model="locationShowList" style="max-width: 800px; margin-bottom: 10px;" v-show="currentServer.server.locations && currentServer.server.locations.length || currentLocation">
              <location-card @delete="deleteLocation(location)" :name="`location-card-${$locationIndex}`" v-for="(location, $locationIndex) in currentServer.server.locations" :key="location.id" :location="location"></location-card>
              <location-card name="add" v-if="currentLocation" @delete="currentLocation = null" ref="locationCardAdd" :is-add="true" :location="currentLocation" key="addLocation"></location-card>
            </el-collapse>
            <div class="tac" style="max-width: 800px;">
              <el-button v-show="!currentLocation" icon="el-icon-plus" @click="addLocation">Add Location</el-button>
              <el-button v-show="!currentLocation" icon="el-icon-sort" @click="sortLocation">Sort</el-button>
              <el-button v-show="currentLocation" type="primary" icon="el-icon-check" @click="saveLocation">Save Addition</el-button>
            </div>
          </el-form-item>
        </template>
        <template v-if="displayMode !== 'visual'">
          <el-form-item label="">
            <el-input @keyup.enter.stop type="textarea" v-model="currentServerString"
                      :autosize="{ minRows: 10, maxRows: 20}"></el-input>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" @click="saveServerConfig()">{{isAdd ? 'Add and Start' : 'Save And Restart'}}</el-button>
          <el-button @click="resetForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="server-content-page__empty text-placeholder" v-if="!isAdd && !currentServer.name">
      Click 'Add Server' button or chose a server
    </div>
    <el-dialog
      title="Sort Location"
      :visible.sync="showSortLocation"
      width="500px">
      <el-tree v-if="currentServer && currentServer.server" :data="currentServer.server.locations" node-key="id" empty-text="No Locations." :props="{label: (data, node) => `${data.url} | ${data.type}`}" draggable :allow-drop="locationAllowDrop"></el-tree>
    </el-dialog>
  </section>
</template>

<script>
import { defaultServerOption, defaultLocationOption, getId } from '../../../server/commonUtils/options'
import LocationCard from './locationCard'
import { mapGetters, mapActions } from 'vuex'
import { merge } from 'lodash'
import PortTest from './portTest'
export default {
  name: 'ServerContentPage',
  data () {
    return {
      tempServerName: '',
      currentServer: {},
      currentLocation: null,
      showSortLocation: false,
      isEdit: false,
      locationShowList: [],
      displayMode: 'visual',
      currentServerString: '{}'
    }
  },
  computed: {
    ...mapGetters({
      getCurrentServer: 'getCurrentServer',
      closeList: 'getCloseList'
    }),
    isAdd () {
      return this.$route.query.add
    }
  },
  created () {
    if (this.isAdd) {
      this.currentServer = defaultServerOption()
      this.currentLocation = null
    }
  },
  methods: {
    ...mapActions([
      'saveServer', 'deleteServer', 'setServerStatus'
    ]),
    addLocation () {
      this.currentLocation = defaultLocationOption()
      if (!this.locationShowList.includes('add')) {
        this.locationShowList.push('add')
      }
    },
    saveServerConfig () {
      if (this.currentLocation) {
        this.saveLocation()
      }
      this.saveServer(this.displayMode === 'visual' ? this.currentServer : JSON.parse(this.currentServerString))
      this.$router.push({
        ...this.$route,
        query: {
          ...this.$route.query,
          add: undefined
        }
      })
    },
    deleteServerConfirm () {
      this.$confirm('Are you sure to delete this server config?', 'Confirm').then(() => {
        this.deleteServer(this.currentServer.id)
      })
    },
    saveLocation () {
      this.currentLocation.id = getId('location')
      this.currentServer.server.locations.push(this.currentLocation)
      this.currentLocation = null
      if (this.locationShowList.includes('add')) {
        this.locationShowList.splice(this.locationShowList.indexOf('add'), 1)
      }
    },
    switchEdit () {
      if (this.isEdit) {
        this.isEdit = false
        this.currentServer.name = this.tempServerName
      } else {
        this.isEdit = true
        this.tempServerName = this.currentServer.name
      }
    },
    deleteLocation (location) {
      if (this.currentServer.server.locations.includes(location)) {
        this.currentServer.server.locations.splice(
          this.currentServer.server.locations.indexOf(location), 1
        )
      }
    },
    resetForm () {
      this.$confirm('Are you sure to reset this server config?', 'Confirm').then(() => {
        this.currentLocation = null
        this.currentServer = this.cloneServer(this.getCurrentServer)
      })
    },
    cloneServer (raw) {
      const server = merge({}, raw)
      if (server.locations && server.locations.length) {
        for (const locationIndex in server.locations) {
          const location = server.locations[locationIndex]
          server.locations[locationIndex] = merge(defaultLocationOption, location)
        }
      }
      return server
    },
    sortLocation () {
      this.showSortLocation = true
    },
    locationAllowDrop (draggingNode, dropNode, type) {
      return type !== 'inner'
    },
    switchServerStatus () {
      this.$confirm(`Are you sure to ${this.closeList.includes(this.currentServer.id) ? 'RESUME' : 'CLOSE'} this Server?`, 'Confirm for switch server status').then(() => {
        this.setServerStatus(this.currentServer.id)
      })
    }
  },
  watch: {
    getCurrentServer (val) {
      this.currentServer = this.cloneServer(val)
      this.currentLocation = null
      this.locationShowList = []
    },
    $route (val) {
      this.displayMode = 'visual'
      if (val.query.add) {
        this.currentServer = defaultServerOption()
        this.currentLocation = null
        this.locationShowList = []
      }
    },
    currentServer (val) {
      this.currentServerString = JSON.stringify(val, undefined, 4)
    },
    displayMode (val) {
      if (val === 'visual') {
        this.$set(this, 'currentServer', JSON.parse(this.currentServerString))
      } else {
        this.currentServerString = JSON.stringify(this.currentServer, undefined, 4)
      }
    }
  },
  components: {
    LocationCard,
    PortTest
  }
}
</script>

<style lang="scss">
  .server-content-page {
    position: relative;
    width: 100%;
    height: 100%;
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
