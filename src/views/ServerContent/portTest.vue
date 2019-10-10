<template>
  <div class="port-test-button">
    <el-button type="primary" @click="showDialog = true">Test</el-button>
    <el-dialog :title="`Port: ${port}`" :visible.sync="showDialog" @closed="clearPortInfo">
      <el-form v-loading="isLoading" label-width="100px">
        <el-form-item label="CanUse">
          <p :class="[canUse ? 'text-success' : 'text-danger', 'big-text-value']">{{(!!canUse + '').toUpperCase()}}</p>
        </el-form-item>
        <el-form-item label="Current PID">
          <p class="big-text-value text-secondary-black">{{ currentPid }}</p>
        </el-form-item>
        <el-form-item label="Process">
          <el-table :data="lsofInfo" style="width: 100%;">
            <el-table-column prop="command" label="command">
              <template slot-scope="scope">
                <span>
                  <el-tag type="primary" v-if="scope.row.pid + '' === currentPid + ''" style="margin-right: 5px;" size="mini">current</el-tag>
                  <span>{{scope.row.command}}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="node" label="node"></el-table-column>
            <el-table-column prop="pid" label="pid"></el-table-column>
            <el-table-column prop="state" label="state"></el-table-column>
            <el-table-column prop="type" label="type"></el-table-column>
            <el-table-column prop="user" label="user"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getPortTest } from '@/api/service/port'
export default {
  name: 'PortTestButton',
  props: {
    port: {
      default: ''
    },
    currentId: {
      default: ''
    }
  },
  data () {
    return {
      showDialog: false,
      lsofInfo: [],
      canUse: false,
      isLoading: false,
      currentPid: ''
    }
  },
  methods: {
    async getPortTest () {
      this.isLoading = true
      await getPortTest({ port: this.port, id: this.currentId }).then(res => {
        if (!res.result) {
          this.canUse = res.data.canUse
          this.lsofInfo = res.data.portInfo || []
          this.currentPid = res.data.currentPid || ''
        }
      })
      setTimeout(() => {
        this.isLoading = false
      }, 200)
    },
    clearPortInfo () {
      this.canUse = false
      this.lsofInfo = []
      this.currentPid = ''
    }
  },
  watch: {
    showDialog (val) {
      if (val) {
        this.getPortTest()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .big-text-value {
    font-size: 20px;
    font-weight: 600;
  }
</style>
