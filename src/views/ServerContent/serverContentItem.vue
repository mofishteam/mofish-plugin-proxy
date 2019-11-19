<template>
  <section class="server-content-item" v-if="(currentServer && currentServer.id && currentServer.server && currentServer.name) || isAdd" :key="'server-' + currentServer.id">
    <el-form ref="form" :model="validateModel" :label-width="displayMode === 'visual' ? '100px' : '100px'" :rules="rules" style="max-width: 800px;">
      <!--顶部信息和操作-->
      <div class="base-info-and-action-box">
        <!--顶部左侧基础信息-->
        <div class="base-info-box">
          <el-form-item label="ServerName" prop="serverName" required>
            <el-input v-model="currentServer.server.name[0]" placeholder="Input server name and press enter to add."></el-input>
          </el-form-item>
          <el-form-item label="SSL">
            <el-switch v-model="currentServer.server.ssl"></el-switch>
          </el-form-item>
          <template v-if="currentServer.server.ssl && currentServer.server.sslOptions">
            <el-form-item label="Key" prop="key" required>
              <el-input v-model="currentServer.server.sslOptions.key"></el-input>
            </el-form-item>
            <el-form-item label="Cert" prop="cert" required>
              <el-input v-model="currentServer.server.sslOptions.cert"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="Listen" prop="listen" required>
            <el-input v-model="currentServer.server.listen" placeholder="Input port for server to listen." style="width: 100%; max-width: 500px;">
              <port-test :current-id="currentServer.id" v-if="currentServer.server.listen" slot="append" :port="currentServer.server.listen"></port-test>
            </el-input>
          </el-form-item>
        </div>
        <!--顶部右侧灰色部分-->
        <div class="action-box">
          <el-form-item label-width="0px" class="tac">
            <el-tooltip effect="light" :disabled="isAdd" :content="`Name of tab display: ${currentServer.name}${currentServer.name === server.name ? '' : ' (EDITED)'}`" placement="top">
              <span class="text-secondary-black server-name" :style="{paddingRight: currentServer.name === server.name ? '0' : '5px'}">
                <el-badge is-dot :hidden="currentServer.name === server.name" style="line-height: 1.3; padding-right: 5px; width: 100%;">
                  <p class="current-server-name-text">{{currentServer.name || 'New Server'}}</p>
                </el-badge>
              </span>
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
        <el-form-item label="">
          <action-bar>
            <el-button slot="left" type="text" @click="saveServerConfig()" :disabled="isEdited">{{isAdd ? 'Add and Start' : 'Save And Restart'}}</el-button>
            <el-divider direction="vertical" slot="left"></el-divider>
            <el-button slot="left" @click="resetForm" :disabled="isEdited" type="text">Reset</el-button>
<!--            <el-switch slot="right" v-model="collapseLocationCard"></el-switch>-->
            <el-popover
              slot="right"
              placement="top-end"
              title="Filter"
              width="300"
              trigger="click">
              <el-button slot="reference" type="text" :class="[isFilterChanged ? 'text-info-important' : 'text-main-important']" style="margin-right: 20px;">
                <span>Filters</span>
              </el-button>
              <el-form :model="locationFilters">
                <el-form-item label="Hide Closed">
                  <el-switch v-model="locationFilters.hideClose"></el-switch>
                </el-form-item>
                <el-form-item label="Type">
                  <el-select v-model="locationFilters.type" size="small">
                    <el-option value="all" label="All">All</el-option>
                    <el-option :value="item.value" :label="item.label" v-for="item in locationTypes" :key="item.value">{{item.label}}</el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-popover>
            <el-button icon="el-icon-plus" slot="right" type="text" @click="addLocation"></el-button>
          </action-bar>
          <grid-layout :layout.sync="locationLayout"
                       :key="`grid-layout-${currentServer.id}-${layoutKeyCount}`"
                       :row-height="collapseLocationCard ? 50 : 90"
                       :is-draggable="!hiddenLocation.length"
                       :is-resizable="false"
                       :is-mirrored="false"
                       :vertical-compact="true"
                       @layout-updated="onLocationLayoutUpdated"
                       v-if="showLocation && (currentServer.server.locations && currentServer.server.locations.length || currentLocation)"
                       :col-num="1">
            <grid-item v-for="location in locationLayout" :key="`location-grid-item-${location.i}`" :dragAllowFrom="location && location.item ? '.move-icon-wrap' : null" :i="location.i" :x="location.x" :y="location.y" :w="location.w" :h="location.h">
              <location-card :hide="hiddenLocation.includes(location.i)" v-if="location && location.item" :is-draggable="!hiddenLocation.length" :key="`location-card-${location.i}`" :current-server="currentServer" @delete="deleteLocation(location.i)" @edit="editLocation" @copy="copyLocation(location)" :location-id="location.i" :is-new="newLocation.has(location.i)"></location-card>
            </grid-item>
<!--            <grid-item :x="0" :y="currentServer.server.locations.length" :w="1" :h="1" i="add">-->
<!--              <location-card name="add" v-if="currentLocation" @delete="currentLocation = null" ref="locationCardAdd" :is-add="true" :location="currentLocation" key="addLocation"></location-card>-->
<!--            </grid-item>-->
          </grid-layout>
<!--          <el-collapse v-model="locationShowList" style="max-width: 800px; margin-bottom: 10px;" v-show="currentServer.server.locations && currentServer.server.locations.length || currentLocation">-->
<!--            <location-card @delete="deleteLocation(location)" :name="`location-card-${$locationIndex}`" v-for="(location, $locationIndex) in currentServer.server.locations" :key="location.id" :location="location"></location-card>-->
<!--            <location-card name="add" v-if="currentLocation" @delete="currentLocation = null" ref="locationCardAdd" :is-add="true" :location="currentLocation" key="addLocation"></location-card>-->
<!--          </el-collapse>-->
          <div class="tac" style="max-width: 800px;">
<!--            <el-button icon="el-icon-plus" @click="addLocation">Add Location</el-button>-->
<!--            <el-button v-show="!currentLocation" icon="el-icon-sort" @click="sortLocation">Sort</el-button>-->
          </div>
        </el-form-item>
      </template>
      <template v-if="displayMode !== 'visual'">
        <el-form-item label="">
          <editor @keyup.enter.stop v-model="currentServerString" height="500"></editor>
        </el-form-item>
      </template>
<!--      <el-form-item class="tac">-->
<!--        <el-button type="primary" @click="saveServerConfig()" :disabled="isEdited">{{isAdd ? 'Add and Start' : 'Save And Restart'}}</el-button>-->
<!--        <el-button @click="resetForm" :disabled="isEdited">Reset</el-button>-->
<!--      </el-form-item>-->
    </el-form>
<!--    <div class="server-content-item__empty text-placeholder" v-if="!currentServer || (!isAdd && !currentServer.name)">-->
<!--      Click 'Add Server' button or chose a server-->
<!--    </div>-->
    <el-dialog
      title="Sort Location"
      :visible.sync="showSortLocation"
      width="500px">
      <el-tree v-if="currentServer && currentServer.server" :data="currentServer.server.locations" node-key="id" empty-text="No Locations." :props="{label: (data, node) => `${data.url} | ${data.type}`}" draggable :allow-drop="locationAllowDrop"></el-tree>
    </el-dialog>
    <el-drawer
      title="Add Location"
      :visible.sync="showAddLocation"
      size="500px"
      custom-class="location-edit-drawer"
      :append-to-body="true"
      :destroy-on-close="true"
      direction="rtl">
      <location-content ref="addLocationContent" v-model="currentLocation" :is-add="true"></location-content>
      <div class="location-edit-drawer_action-button tac">
        <el-button type="primary" @click="saveLocation">Save</el-button>
        <el-button plain @click="resetCurrentLocation">Reset</el-button>
      </div>
    </el-drawer>
  </section>
</template>

<script>
import { defaultLocationOption, getId } from '../../../server/commonUtils/options'
import LocationCard from './locationCard'
import LocationContent from './locationContent'
import { mapGetters, mapActions } from 'vuex'
import { merge, isEqual } from 'lodash'
import cloneDeep from 'lodash.clonedeep'
import PortTest from './portTest'
import editor from '@/components/Common/jsonEditor.vue'
import VueGridLayout from 'vue-grid-layout'
import ActionBar from '@/components/Common/locationCardActionBar'
import config from '@/config'
import getRules from './serverValidateRule'

const getDefaultLocationFilters = () => ({
  hideClose: false,
  type: 'all'
})

const defaultLocationFilters = getDefaultLocationFilters()

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
      currentLocation: defaultLocationOption(),
      showSortLocation: false,
      isEdit: false,
      locationShowList: [],
      displayMode: 'visual',
      currentServerString: '{}',
      edited: false,
      showAddLocation: false,
      locationLayout: [],
      showLocation: true,
      newLocation: new Set(),
      locationFilters: getDefaultLocationFilters(),
      layoutKeyCount: 0,
      locationTypes: config.locationTypes,
      rules: getRules(this),
      collapseLocationCard: false
    }
  },
  computed: {
    ...mapGetters({
      closeList: 'getCloseList',
      draftEditedList: 'getDraftEditedList',
      currentActiveServer: 'getCurrentServer'
    }),
    isEdited () {
      return !this.draftEditedList.includes(this.server.id) && !this.isAdd
    },
    hiddenLocation () {
      return this.locationLayout.filter(item => {
        const showClose = this.locationFilters.hideClose ? !item.item.isClose : true
        const showType = this.locationFilters.type === 'all' || this.locationFilters.type === item.item.type
        return !(showClose && showType)
      }).map(item => item.i)
    },
    isFilterChanged () {
      return isEqual(this.locationFilters, defaultLocationFilters)
    },
    validateModel () {
      return {
        serverName: this.currentServer.server.name[0],
        key: this.currentServer.server.sslOptions.key,
        cert: this.currentServer.server.sslOptions.cert,
        listen: this.currentServer.server.listen
      }
    }
  },
  created () {
    this.$bus.$on('saveChange', () => {
      if (this.currentActiveServer === this.currentServer.id && !this.isEdited) {
        this.saveServerConfig()
      }
    })
    this.initLocationLayout()
  },
  methods: {
    ...mapActions([
      'saveServer', 'deleteServer', 'setServerStatus', 'deleteServerConfirm', 'setActiveServer', 'editDraftContent'
    ]),
    registerNewLocation (locationId) {
      this.newLocation.add(locationId)
      setTimeout(() => {
        this.newLocation.delete(locationId)
        this.$set(this, 'newLocation', this.newLocation)
      }, 10000)
    },
    initLocationLayout () {
      if (this.currentServer && this.currentServer.server && this.currentServer.server && this.currentServer.server.locations) {
        const isSame = this.currentServer.server.locations.reduce((sum, cur, idx) => {
          if (!sum) {
            return false
          } else {
            return this.locationLayout[idx] && cur.id === this.locationLayout[idx].i
          }
        }, true)
        if (!isSame) {
          const layouts = {}
          this.locationLayout.forEach(val => {
            layouts[val.i] = val
          })
          this.locationLayout.splice(0)
          this.currentServer.server.locations.map((val, idx) => {
            let item = layouts[val.id]
            if (item) {
              item.y = idx
            } else {
              item = {
                x: 0,
                y: idx,
                w: 12,
                h: 1,
                i: val.id,
                item: val
              }
            }
            this.locationLayout.push(item)
          })
        }
      }
    },
    resetCurrentLocation () {
      this.$refs.addLocationContent && this.$refs.addLocationContent.clearValidate()
      this.currentLocation = defaultLocationOption()
    },
    editLocation (location) {
      const locationId = location.id
      const oldLocationItem = this.currentServer.server.locations.find(item => item.id === locationId)
      if (oldLocationItem) {
        for (const key in oldLocationItem) {
          oldLocationItem[key] = undefined
        }
        for (const key in location) {
          oldLocationItem[key] = location[key]
        }
        this.$set(this, 'oldLocationItem', oldLocationItem)
      }
    },
    addLocation () {
      this.resetCurrentLocation()
      this.showAddLocation = true
    },
    async saveServerConfig () {
      // if (this.currentLocation) {
      //   this.saveLocation()
      // }
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (!this.currentServer.name) {
            const result = await this.$prompt('Input character for server tab name', 'Input server tab name', {
              inputValue: '',
              cancelButtonText: 'Cancel',
              confirmButtonText: 'Confirm',
              inputValidator: (val) => {
                if (!val) {
                  return 'Please input a name.'
                } else {
                  return true
                }
              }
            })
            if (result.action === 'confirm') {
              this.currentServer.name = result.value
            } else {
              return Promise.reject(new Error('No Server Name'))
            }
          }
          await this.setActiveServer(this.currentServer.id)
          await this.saveServer(this.displayMode === 'visual' ? this.currentServer : JSON.parse(this.currentServerString))
        } else {
          this.$message({
            type: 'error',
            message: 'Please complete the form first.'
          })
        }
      })
    },
    copyLocation (locationLayoutItem) {
      const newId = getId('location')
      const newLocation = cloneDeep(locationLayoutItem.item)
      newLocation.id = newId
      this.currentServer.server.locations.splice(locationLayoutItem.y + 1, 0, newLocation)
      this.registerNewLocation(newId)
    },
    async saveLocation () {
      // this.currentLocation.id = getId('location')
      const validateResult = await this.$refs.addLocationContent.validate()
      if (validateResult) {
        this.currentServer.server.locations.push(this.currentLocation)
        this.registerNewLocation(this.currentLocation.id)
        this.showAddLocation = false
      }
      // this.currentLocation = null
      // if (this.locationShowList.includes('add')) {
      //   this.locationShowList.splice(this.locationShowList.indexOf('add'), 1)
      // }
    },
    deleteLocation (location) {
      const result = this.currentServer.server.locations.find(val => {
        return val.id === location
      })
      if (result) {
        this.locationLayout.splice(
          this.locationLayout.findIndex(item => item.id === result.id), 1
        )
        this.currentServer.server.locations.splice(
          this.currentServer.server.locations.indexOf(result), 1
        )
      }
    },
    resetForm () {
      this.$confirm('Are you sure to reset this server config?', 'Confirm', {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm'
      }).then(async () => {
        this.showLocation = false
        this.currentLocation = defaultLocationOption()
        this.currentServer = this.cloneServer(this.server)
        await this.$nextTick()
        this.showLocation = true
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
        inputValue: this.isAdd ? '' : this.currentServer.name,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm',
        inputValidator: (val) => {
          if (!val) {
            return 'Please input a name.'
          } else {
            return true
          }
        }
      }).then(result => {
        if (result.action === 'confirm') {
          this.currentServer.name = result.value
        }
      })
    },
    setSSLKeyFilePath (file) {
      // console.log(file)
    },
    getFilePath () {},
    onLayoutUpdate (layouts) {
      // console.log(layouts)
    },
    onLocationLayoutUpdated (layouts) {
      const locations = []
      layouts.forEach(item => {
        locations[item.y] = item.item
      })
      this.$set(this.currentServer.server, 'locations', locations)
    }
  },
  watch: {
    server (val) {
      // this.currentServer = this.cloneServer(val)
      // this.currentLocation = null
      this.locationShowList = []
    },
    currentServer: {
      deep: true,
      handler (val) {
        this.edited = true
        this.editDraftContent({ id: val.id, val })
        this.currentServerString = JSON.stringify(val, undefined, 4)
        // console.log(val, oldVal)
        // if (!oldVal || (val && val.id !== oldVal.id)) {
        //   console.log('initLocationLayout')
        this.initLocationLayout()
        // }
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
    LocationContent,
    PortTest,
    editor,
    ActionBar,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  }
}
</script>

<style lang="scss">
  @import "~@/assets/style/base.scss";
  .server-content-item {
    position: relative;
    width: 100%;
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
          vertical-align: middle;
          .current-server-name-text {
            text-overflow:ellipsis;
            white-space: nowrap;
            overflow: hidden;
            width: 100%;
          }
        }
      }
    }
    .server-content-item__empty {
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      text-align: center;
      transform: translateY(-50%);
      font-size: 24px;
    }
    .server-content-item__container {
      margin-bottom: 20px;
    }
  }
</style>
