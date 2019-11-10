<template>
  <el-card class="location-card" shadow="hover" :body-style="{paddingTop: '5px', paddingBottom: '0'}">
    <div class="location-card_title">
      <span class="move-icon-wrap text-main" @mouseenter="$emit('move')" @mouseleave="$emit('static')">
        <i class="el-icon-bottom-right static-icon"></i>
        <i class="el-icon-rank move-icon"></i>
      </span>
      <span class="location-card_url">{{location.url}}</span>
      <el-tag size="small" class="location-card_status-tag">{{location.type}}</el-tag>
      <el-tag size="small" v-show="location.isClose" type="danger" class="location-card_status-tag">CLOSED</el-tag>
      <el-button type="text" icon="el-icon-edit-outline" class="location-card_action-button" @click="edit"></el-button>
      <el-button type="text" icon="el-icon-delete" class="location-card_action-button text-danger" @click="deleteSelf"></el-button>
    </div>
    <div class="location-card_info">
      <template v-if="location.type === 'proxyPass'">
        <div class="location-card_info-item">
          <p class="location-card_info-item-title text-secondary-black">Target:</p>
          <p class="location-card_info-item-value text-main">{{location.proxyPass.target}}</p>
        </div>
        <el-divider direction="vertical" class="location-card_info-item-divider"></el-divider>
        <div class="location-card_info-item">
          <p class="location-card_info-item-title text-secondary-black">ChangeOrigin:</p>
          <p :class="['location-card_info-item-value', 'text-main', location.proxyPass.changeOrigin ? 'text-success' : 'text-info']">{{(location.proxyPass.changeOrigin + '').toUpperCase()}}</p>
        </div>
      </template>
      <template v-if="location.type === 'mock'">
        <div class="location-card_info-item">
          <p class="location-card_info-item-title text-secondary-black">MockData:</p>
          <el-popover placement="top" trigger="click">
            <p slot="reference" class="location-card_info-item-value text-main" style="cursor: pointer;" @click="viewData">View Data</p>
            <pre>{{JSON.stringify(JSON.parse(location.mock.json), '', 2)}}</pre>
          </el-popover>
        </div>
      </template>
      <template v-if="location.type === 'static'">
        <div class="location-card_info-item">
          <p class="location-card_info-item-title text-secondary-black">Path:</p>
          <el-popover placement="top" trigger="click" :content="location.static.path">
            <p slot="reference" class="location-card_info-item-value text-main location-static-path" style="cursor: pointer;">{{location.static.path}}</p>
          </el-popover>
        </div>
      </template>
      <el-divider direction="vertical" class="location-card_info-item-divider"></el-divider>
      <div class="location-card_info-item">
        <p class="location-card_info-item-title text-secondary-black">Delay:</p>
        <p class="location-card_info-item-value text-main">
          <span :class="location.delay + '' === '0' ? 'text-info' : 'text-warning'">{{location.delay}}ms</span>
        </p>
      </div>
    </div>
    <el-drawer
      title="Edit Location"
      :visible.sync="showEditDialog"
      size="500px"
      custom-class="location-edit-drawer"
      :append-to-body="true"
      direction="rtl">
      <location-content v-model="currentLocation"></location-content>
      <div class="location-edit-drawer_action-button tac">
        <el-button type="primary" @click="saveLocation">Save</el-button>
        <el-button plain @click="resetCurrentLocation">Reset</el-button>
      </div>
    </el-drawer>
  </el-card>
</template>

<script>
// import { defaultLocationOption } from '../../../server/commonUtils/options'
import LocationContent from './locationContent'
import clone from 'lodash.clonedeep'
export default {
  name: 'LocationCard',
  props: {
    locationId: {
      default: '',
      type: String
    },
    currentServer: {
      default: () => ({
        server: {}
      }),
      type: Object
    }
  },
  data () {
    return {
      currentLocation: clone(this.location || {}),
      showEditDialog: false
    }
  },
  methods: {
    async edit () {
      this.resetCurrentLocation()
      await this.$nextTick()
      this.showEditDialog = true
    },
    viewData () {},
    saveLocation () {
      this.$emit('edit', this.currentLocation)
      this.showEditDialog = false
    },
    resetCurrentLocation () {
      this.currentLocation = clone(this.location)
    },
    deleteSelf () {
      this.$confirm('Are you sure to delete this Location?', 'Confirm', {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm'
      }).then(() => {
        this.$emit('delete')
      })
    }
  },
  computed: {
    location () {
      return this.currentServer.server.locations.find((item) => {
        return item.id === this.locationId
      })
    }
  },
  watch: {
  },
  components: {
    LocationContent
  }
}
</script>

<style lang="scss">
  .location-card {
    height: 90px;
    .move-icon-wrap {
      position: relative;
      width: 20px;
      height: 20px;
      text-align: center;
      & > i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .move-icon {
        opacity: 0;
      }
    }
    &:hover {
      .move-icon {
        opacity: 1;
      }
      .static-icon {
        opacity: 0;
      }
    }
    .location-card_action-button {
      /*width: 36px;*/
      display: block;
      text-align: center;
      margin-left: 10px;
    }
    &_status-tag {
      margin-right: 5px;
    }
    &_title {
      display: flex;
      align-items: center;
    }
    &_url {
      margin-left: 10px;
      font-weight: bold;
      flex: 1;
    }
    &_info {
      display: flex;
      .el-divider--vertical {
        height: 30px;
      }
      &-item {
        line-height: 1.3;
        cursor: default;
        &-title {
          font-size: 12px;
          line-height: 1;
          transform: scale(.8);
          transform-origin: 0 100%;
          transition: .3s;
          opacity: .8;
        }
        &-value {
          opacity: .8;
          transition: .3s;
        }
        &:hover {
          .location-card_info-item-title {
            transform: scale(1);
            opacity: 1;
          }
          .location-card_info-item-value {
            opacity: 1;
          }
        }
      }
    }
    .location-static-path {
      max-width: 200px;
      overflow:hidden; //超出的文本隐藏
      text-overflow:ellipsis; //溢出用省略号显示
      white-space:nowrap; //溢出不换行
    }
  }
</style>
