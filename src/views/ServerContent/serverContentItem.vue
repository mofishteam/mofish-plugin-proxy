<template>
  <section class="server-content-page" v-if="(currentServer && currentServer.id && currentServer.server && currentServer.name) || isAdd" :key="'server-' + currentServer.id">
    <el-form ref="form" :model="currentServer" :label-width="displayMode === 'visual' ? '100px' : '100px'" style="max-width: 800px;">
      <!--顶部信息和操作-->
      <div class="base-info-and-action-box">
        <!--顶部左侧基础信息-->
        <div class="base-info-box">
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
        </div>
        <!--顶部右侧灰色部分-->
        <div class="action-box">
          <el-form-item label-width="0px" class="tac">
            <el-tooltip effect="light" :content="`Name of tab display: ${currentServer.name}`" placement="top">
              <span class="text-secondary-black server-name">{{currentServer.name}}</span>
            </el-tooltip>
            <el-button type="text" icon="el-icon-edit-outline" style="margin-left: 5px; vertical-align: middle;" @click="editServerTabName"></el-button>
          </el-form-item>
          <el-form-item class="tac" label-width="0px">
            <el-switch v-model="displayMode"
                       active-value="visual"
                       active-text="Visual mode"
                       inactive-text="Code mode"
                       inactive-value="code"></el-switch>
          </el-form-item>
          <el-form-item label-width="0px" class="tac">
            <el-button size="mini" :type="closeList.includes(currentServer.id) || isAdd ? 'danger' : 'success'" icon="el-icon-switch-button" :disabled="isAdd" @click="switchServerStatus">{{closeList.includes(currentServer.id) ? 'Closed' : (isAdd ? 'Please save first' : 'Running')}}</el-button>
            <el-button type="danger" icon="el-icon-delete" :disabled="isAdd" @click="deleteServerConfirm(currentServer.id)" size="mini">Delete</el-button>
          </el-form-item>
        </div>
      </div>
      <template v-if="displayMode === 'visual'">
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
        <el-button type="primary" @click="saveServerConfig()" :disabled="!draftEditedList.includes(server.id) && !isAdd">{{isAdd ? 'Add and Start' : 'Save And Restart'}}</el-button>
        <el-button @click="resetForm" :disabled="!draftEditedList.includes(server.id) && !isAdd">Reset</el-button>
      </el-form-item>
    </el-form>
<!--    <div class="server-content-page__empty text-placeholder" v-if="!currentServer || (!isAdd && !currentServer.name)">-->
<!--      Click 'Add Server' button or chose a server-->
<!--    </div>-->
    <el-dialog
      title="Sort Location"
      :visible.sync="showSortLocation"
      width="500px">
      <el-tree v-if="currentServer && currentServer.server" :data="currentServer.server.locations" node-key="id" empty-text="No Locations." :props="{label: (data, node) => `${data.url} | ${data.type}`}" draggable :allow-drop="locationAllowDrop"></el-tree>
    </el-dialog>
  </section>
</template>

<script>
import { defaultLocationOption, getId } from '../../../server/commonUtils/options'
import LocationCard from './locationCard'
import { mapGetters, mapActions } from 'vuex'
import { merge } from 'lodash'
import PortTest from './portTest'
export default {
  name: 'ServerContentItem',
  props: {
    server: {
      default: () => ({})
    },
    isAdd: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      tempServerName: '',
      currentServer: this.cloneServer(this.server),
      currentLocation: null,
      showSortLocation: false,
      isEdit: false,
      locationShowList: [],
      displayMode: 'visual',
      currentServerString: '{}',
      edited: false
    }
  },
  computed: {
    ...mapGetters({
      closeList: 'getCloseList',
      draftEditedList: 'getDraftEditedList'
    })
  },
  created () {
  },
  methods: {
    ...mapActions([
      'saveServer', 'deleteServer', 'setServerStatus', 'deleteServerConfirm', 'setActiveServer', 'editDraftContent'
    ]),
    addLocation () {
      this.currentLocation = defaultLocationOption()
      if (!this.locationShowList.includes('add')) {
        this.locationShowList.push('add')
      }
    },
    async saveServerConfig () {
      if (this.currentLocation) {
        this.saveLocation()
      }
      await this.setActiveServer(this.currentServer.id)
      await this.saveServer(this.displayMode === 'visual' ? this.currentServer : JSON.parse(this.currentServerString))
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
      this.$confirm('Are you sure to reset this server config?', 'Confirm', {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm'
      }).then(() => {
        this.currentLocation = null
        this.currentServer = this.cloneServer(this.server)
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
      this.$confirm(`Are you sure to ${this.closeList.includes(this.currentServer.id) ? 'RESUME' : 'CLOSE'} this Server?`, 'Confirm for switch server status', {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm'
      }).then(() => {
        this.setServerStatus(this.currentServer.id)
      })
    },
    editServerTabName () {
      this.$prompt('Input character for server tab name', 'Edit server tab name', {
        inputValue: this.currentServer.name,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm'
      }).then(result => {
        if (result.action === 'confirm') {
          this.currentServer.name = result.value
        }
      })
    }
  },
  watch: {
    server (val) {
      console.log('server change: ', val)
      // this.currentServer = this.cloneServer(val)
      this.currentLocation = null
      this.locationShowList = []
    },
    currentServer: {
      deep: true,
      handler (val) {
        console.log('currentServerChanged')
        this.edited = true
        this.editDraftContent({ id: val.id, val })
        this.currentServerString = JSON.stringify(val, undefined, 4)
      }
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
  @import "~@/assets/style/base.scss";
  .server-content-page {
    position: relative;
    width: 100%;
    height: 100%;
    .base-info-and-action-box {
      display: flex;
      margin-bottom: 20px;
      .base-info-box {
        flex: 1;
        .el-form-item:last-child {
          margin-bottom: 0;
        }
      }
      .action-box {
        width: 270px;
        margin-left: 20px;
        border-radius: 4px;
        background-color: lighten($placeholder-text-color, 19.5%);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-top: -10px;
        .el-form-item {
          margin-bottom: 0;
        }
        .server-name {
          font-size: 16px;
          font-weight: bold;
          max-width: 200px;
          display: inline-block;
          overflow: hidden;
          vertical-align: middle;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
    }
    .server-content-page__empty {
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      text-align: center;
      transform: translateY(-50%);
      font-size: 24px;
    }
    .server-content-page__container {
      margin-bottom: 20px;
    }
  }
</style>
