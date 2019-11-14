<template>
  <div class="function-generator">
    <el-button @click="addDialogVisible = true">Add</el-button>
    <el-dialog title="Add Generator"
               :modal-append-to-body="true"
               :append-to-body="true"
               :destroy-on-close="true"
               :visible.sync="addDialogVisible">
      <add-dialog-content @change="addGeneratorData = $event"></add-dialog-content>
      <div slot="footer">
        <el-button @click="addDialogVisible = false">Cancel</el-button>
        <el-button @click="confirmAdd" :disabled="addGeneratorData === null">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AddDialogContent from './add'
export default {
  name: 'FunctionGenerator',
  data () {
    return {
      addDialogVisible: false,
      addGeneratorData: null
    }
  },
  methods: {
    confirmAdd () {
      this.addGeneratorData = null
      this.addDialogVisible = false
    }
  },
  components: {
    AddDialogContent
  }
}
</script>
