<template>
  <el-dialog :visible.sync="curValue" :title="`${isAdd ? 'Add ' : 'Edit '}Interceptor`">
    <el-form ref="interceptorDialog" :model="interceptorScope" label-width="100px">
      <el-form-item label="Name">
        <el-input v-model="interceptorScope.name"></el-input>
      </el-form-item>
      <el-form-item label="Type">
        <el-select v-model="interceptorScope.type">
          <el-option label="Response" value="response"></el-option>
          <el-option label="Request" value="request"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Handler">
        <p>async function (ctx) {</p>
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="interceptorScope.handler" type="textarea" :rows="10"></el-input>
      </el-form-item>
      <el-form-item label="">
        <p>}</p>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">Cancel</el-button>
      <el-button type="primary" @click="confirm">Confirm</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { defaultInterceptorOption } from '../../../server/commonUtils/options'
import { merge } from 'lodash'
export default {
  name: 'InterceptorDialog',
  props: {
    value: {
      default: false,
      type: Boolean
    },
    interceptors: {
      default: () => ([])
    },
    isAdd: {
      default: true,
      type: Boolean
    },
    interceptorId: {
      default: ''
    }
  },
  data () {
    return {
      curValue: false,
      interceptor: defaultInterceptorOption(),
      tempInterceptor: defaultInterceptorOption()
    }
  },
  created () {
    this.curValue = this.value
  },
  methods: {
    cancel () {
      this.reset()
      this.curValue = false
    },
    reset () {
      this.interceptor = defaultInterceptorOption()
      this.tempInterceptor = defaultInterceptorOption()
    },
    confirm () {
      if (this.isAdd) {
        this.interceptors = this.interceptors || { response: [], request: [] }
        this.interceptors[this.interceptor.type].push(this.interceptor)
        this.$emit('change', this.interceptors)
        this.$message.success('Add interceptor success.')
      } else {
        this.$emit('edit', this.tempInterceptor)
        this.$message.success('Edit interceptor success.')
      }
      this.reset()
      this.curValue = false
    },
    setTempInterceptorValue () {
      const resResult = this.interceptors.response.find(item => item.id === this.interceptorId)
      const reqResult = this.interceptors.request.find(item => item.id === this.interceptorId)
      const interceptorItem = resResult || reqResult
      this.$set(this, 'tempInterceptor', merge({}, interceptorItem))
    }
  },
  watch: {
    value (val) {
      this.curValue = val
    },
    curValue (val) {
      this.$emit('input', val)
      if (val && !this.isAdd) {
        this.setTempInterceptorValue()
      }
    }
  },
  computed: {
    interceptorScope () {
      return this.isAdd ? this.interceptor : this.tempInterceptor
    }
  }
}
</script>
