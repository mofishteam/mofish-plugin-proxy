<template>
  <div class="json-editor">
    <editor v-model="currentValue" @init="editorInit" lang="json" theme="chrome" width="450" :height="height"></editor>
    <el-dialog :visible.sync="showDialog" :fullscreen="isFullscreen">
      <div slot="title">
        <span>Json data editor</span>
        <el-button icon="el-icon-full-screen" round plain style="margin-left: 10px" @click="isFullscreen = !isFullscreen">Fullscreen</el-button>
      </div>
      <editor v-model="fullscreenValue" @init="editorInit" lang="json" theme="chrome" width="100%" height="500px"></editor>
      <div slot="footer">
        <el-button icon="el-icon-magic-stick" @click="fullscreenValue = format(fullscreenValue)" type="success" style="float: left;">Format</el-button>
        <el-button @click="showDialog = false">Cancel</el-button>
        <el-button type="primary" @click="confirm">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import editor from 'vue2-ace-editor'
export default {
  name: 'JsonEditor',
  props: {
    value: {},
    height: {
      default: '100'
    }
  },
  data () {
    return {
      currentValue: this.value || '',
      fullscreenValue: this.value,
      showDialog: false,
      isFullscreen: false
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    currentValue (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    editorInit () {
      require('brace/ext/language_tools')
      require('brace/mode/json')
      require('brace/mode/less')
      require('brace/theme/chrome')
    },
    fullscreen () {
      this.fullscreenValue = this.value
      this.showDialog = true
    },
    confirm () {
      this.currentValue = this.fullscreenValue
      this.showDialog = false
    },
    format (jsonStr) {
      return JSON.stringify(JSON.parse(jsonStr), null, 4)
    }
  },
  components: {
    editor
  }
}
</script>

<style lang="scss">
  @import "~@/assets/style/base.scss";
  .json-editor {
    border: 1px solid $third-level-border-color;
  }
</style>
