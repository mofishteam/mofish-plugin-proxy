<template>
  <editor class="json-editor" v-model="currentValue" @init="editorInit" lang="json" theme="chrome" width="500" height="100"></editor>
</template>

<script>
import editor from 'vue2-ace-editor'
export default {
  name: 'JsonEditor',
  props: {
    value: {}
  },
  data () {
    return {
      currentValue: this.value || ''
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
