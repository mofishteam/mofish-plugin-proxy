<template>
  <el-card class="location-card" shadow="hover" :body-style="{paddingTop: '5px', paddingBottom: '0'}">
    <div class="location-card_title">
      <el-button type="text" icon="el-icon-arrow-right" class="text-secondary-black expand-button"></el-button>
      <span class="location-card_url">{{location.url}}{{location.id}}</span>
      <el-tag size="small" class="location-card_status-tag">{{location.type}}</el-tag>
      <el-tag size="small" v-show="location.isClose" type="danger" class="location-card_status-tag">CLOSED</el-tag>
      <el-button type="text" icon="el-icon-edit-outline" class="location-card_action-button"></el-button>
      <el-button type="text" icon="el-icon-delete" class="location-card_action-button text-danger"></el-button>
    </div>
    <div class="location-card_info">
      <template v-if="location.type === 'proxyPass'">
        <div class="location-card_info-item">
          <p class="location-card_info-item-title text-secondary-black">Target:</p>
          <p class="location-card_info-item-value text-main">{{location.proxyPass.target}}</p>
        </div>
        <el-divider direction="vertical" class="location-card_info-item-divider"></el-divider>
      </template>
    </div>
  </el-card>
</template>

<script>
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
    }
  },
  computed: {
    location () {
      console.log(this.currentServer)
      return this.currentServer.server.locations.find((item) => {
        return item.id === this.locationId
      })
    }
  }
}
</script>

<style lang="scss">
  .location-card {
    height: 90px;
    .location-card_action-button {
      width: 36px;
      display: block;
      text-align: center;
      margin-left: 0;
    }
    &_status-tag {
      margin-right: 5px;
    }
    &_title {
      display: flex;
      align-items: center;
    }
    &_url {
      margin-left: 15px;
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
  }
</style>
