<template>
  <section class="server-content" v-if="content">
    <div class="server-content_left">
      <card>
        123
      </card>
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
          <template v-if="content.type === 'child'">
            <el-form-item label="Listen">
              <el-input type="number" v-model="content.server.listen"></el-input>
            </el-form-item>
          </template>
          <el-form-item label=" ">
            <el-button class="full-width">Save</el-button>
          </el-form-item>
        </el-form>
      </card>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ServerContent',
  props: {
    content: {
      default: null,
      type: Object,
      sync: true
    }
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
  }
</style>
