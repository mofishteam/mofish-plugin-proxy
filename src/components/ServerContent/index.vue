<template>
  <section class="server-content" v-if="content">
    <div class="server-content_left">
      <card class="location-toolbar-card">
        <div class="location-toolbar">
          <p class="location-toolbar_title">Locations</p>
          <div class="flex-spring"></div>
          <div class="location-toolbar_list-right">
            <el-button type="text" icon="el-icon-search" class="toolbar-item"></el-button>
            <el-button type="text" icon="el-icon-plus" class="toolbar-item"></el-button>
          </div>
        </div>
      </card>
      <ul class="location-list">
        <draggable v-model="content.server.locations" handle=".location-content_icon">
          <transition-group>
            <location-card :location="location" class="location-item" v-for="location in content.server.locations" :key="location.id"></location-card>
          </transition-group>
        </draggable>
      </ul>
    </div>
    <div class="server-content_right">
      <card>
        <el-form label-position="top" label-width="100px" :model="content" size="medium">
          <el-form-item label="Name">
            <el-input v-model="content.name"></el-input>
          </el-form-item>
          <el-form-item label="Type">
            <el-radio-group v-model="content.type" size="small">
              <el-radio-button label="child">Proxy Pass</el-radio-button>
              <el-radio-button label="mitm">Man-in-the-middle</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Server Name">
            <el-select class="full-width" v-model="content.server.name" multiple placeholder="Select an option.">
              <el-option
                key="ServerNameLocalhost"
                label="localhost"
                value="localhost">
              </el-option>
              <el-option
                key="ServerName127"
                label="127.0.0.1"
                value="127.0.0.1">
              </el-option>
              <el-option
                key="ServerName0"
                label="0.0.0.0"
                value="0.0.0.0">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="SSL">
            <el-radio-group v-model="content.server.ssl" size="small">
              <el-radio-button :label="true">ON</el-radio-button>
              <el-radio-button :label="false">OFF</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <template v-if="content.server.ssl">
            <el-form-item label="Private KEY">
              <el-upload
                :class="['upload-demo', 'row-upload', {'hide-uploader': content.server.sslOptions.key}]"
                drag
                action=""
                :before-upload="setCertKeyFile">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">Drag Cert here or <em>Click To Select File</em></div>
                <div class="el-upload__tip" slot="tip">Only Cert file can be used, and this is only a file address.</div>
              </el-upload>
              <p class="ssl-result" v-show="content.server.sslOptions.key">
                <span class="file-name">{{content.server.sslOptions.key}}</span>
                <el-button type="text" icon="el-icon-close" @click="content.server.sslOptions.key = ''"></el-button>
              </p>
            </el-form-item>
            <el-form-item label="Public KEY">
              <el-upload
                :class="['upload-demo', 'row-upload', {'hide-uploader': content.server.sslOptions.cert}]"
                drag
                action=""
                :before-upload="setCertFile">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">Drag Cert here or <em>Click To Select File</em></div>
                <div class="el-upload__tip" slot="tip">Only Cert file can be used, and this is only a file address.</div>
              </el-upload>
              <p class="ssl-result" v-show="content.server.sslOptions.cert">
                <span class="file-name">{{content.server.sslOptions.cert}}</span>
                <el-button type="text" icon="el-icon-close" @click="content.server.sslOptions.cert = ''"></el-button>
              </p>
            </el-form-item>
          </template>
          <template v-if="content.type === 'child'">
            <el-form-item label="Listen">
              <el-input type="number" v-model="content.server.listen"></el-input>
            </el-form-item>
          </template>
          <el-form-item label=" ">
            <el-dropdown class="full-width" type="primary" @command="onChangeSubmitMode">
              <el-button class="full-width" :disabled="!isCurrentModified">{{submitMode}}</el-button>
              <el-dropdown-menu slot="dropdown" :disabled="!isCurrentModified">
                <el-dropdown-item command="Save">Save Only</el-dropdown-item>
                <el-dropdown-item command="Save and Reload">Save and Reload</el-dropdown-item>
                <el-dropdown-item command="Reload">Reload Only</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-form>
      </card>
    </div>
  </section>
</template>

<script>
import draggable from 'vuedraggable'
import LocationCard from './Location'
import { mapGetters } from 'vuex'
export default {
  name: 'ServerContent',
  data () {
    return {
      submitMode: 'Save'
    }
  },
  props: {
    content: {
      default: null,
      type: Object,
      sync: true
    }
  },
  computed: {
    ...mapGetters({
      isCurrentModified: 'getIsCurrentModified'
    })
  },
  methods: {
    setCertKeyFile (file) {
      this.content.server.sslOptions.key = file.path
    },
    setCertFile (file) {
      this.content.server.sslOptions.cert = file.path
    },
    onChangeSubmitMode (command) {
      this.submitMode = command
    }
  },
  components: {
    LocationCard,
    draggable
  }
}
</script>

<style lang="scss">
  @import "~@/assets/style/base.scss";
  .server-content {
    width: 100%;
    height: calc(100vh - #{$title-bar-height});
    background-color: $main-white;
    display: flex;
    color: $common-text-color;
    & > * {
      flex: 1;
      width: 50%;
      box-sizing: border-box;
      overflow: scroll;
    }
    .server-content_left {
      padding: $main-padding $main-padding / 2 $main-padding $main-padding;
    }
    .server-content_right {
      padding: $main-padding $main-padding $main-padding $main-padding / 2;
    }
    .location-toolbar-card {
      padding-top: 4px;
      padding-bottom: 4px;
    }
    .location-toolbar {
      display: flex;
      .location-toolbar_title {
        align-self: center;
      }
      .toolbar-item {
        width: 30px;
      }
    }
    .location-list {
      margin-top: $main-padding;
    }
    .ssl-result {
      display: flex;
      align-items: center;
      .file-name {
        flex: 1;
      }
    }
  }
</style>
