<template>
  <div class="location-content">
    <el-form :key="`location-${currentValue.id}-form`" :ref="`location-${currentValue.id}`" :model="formValidateData" label-width="100px">
<!--        URL-->
      <el-form-item label="Location" prop="url" required>
        <el-input v-model="currentValue.url" placeholder="Please input location url."></el-input>
      </el-form-item>
<!--        是否关闭（添加时才展示，修改的话还不如在外面改，所以隐藏）-->
      <el-form-item v-if="isAdd">
        <span slot="label" class="text-danger">Close</span>
        <el-switch active-color="#ff4949" v-model="currentValue.isClose"></el-switch>
      </el-form-item>
<!--        延迟时间（ms）-->
      <el-form-item label="Delay" prop="delay" required>
        <el-input style="width: 100px;" placeholder="0" v-model="currentValue.delay">
          <span slot="suffix">ms</span>
        </el-input>
      </el-form-item>
<!--        Location类型-->
      <el-form-item label="Type">
        <el-radio-group v-model="currentValue.type" size="small">
          <el-radio-button :label="item.value" v-for="item in locationTypes" :key="item.value">{{item.label}}</el-radio-button>
          <!--                      <el-radio-button label="alias"></el-radio-button>-->
        </el-radio-group>
      </el-form-item>
    </el-form>
<!--      Type === 'mock'-->
    <el-form :key="`location-${currentValue.id}-mock-form`" :ref="`location-${currentValue.id}-mock`" v-if="currentValue.type === 'mock'" label-width="100px" :model="currentValue.mock">
<!--        Location过滤的Method-->
      <el-form-item label="Method">
        <el-radio-group v-model="currentValue.mock.method" size="small">
          <el-radio-button label="all">ALL</el-radio-button>
          <el-radio-button label="get">GET</el-radio-button>
          <el-radio-button label="post">POST</el-radio-button>
          <el-radio-button label="put">PUT</el-radio-button>
          <el-radio-button label="delete">DELETE</el-radio-button>
        </el-radio-group>
      </el-form-item>
<!--        Mock类型-->
      <el-form-item label="MockType">
        <el-radio-group v-model="currentValue.mock.type" size="small">
          <el-radio-button label="json">JSON</el-radio-button>
          <!--            <el-radio-button label="jsonFile">JSONFile</el-radio-button>-->
          <!--            <el-radio-button label="function">Function</el-radio-button>-->
          <!--            <el-radio-button label="proxyPass">ProxyPass</el-radio-button>-->
        </el-radio-group>
      </el-form-item>
<!--        MockType === 'json'-->
      <template v-if="currentValue.mock.type === 'json'">
        <el-form-item label="MockData" prop="json" required>
          <el-row :gutter="10" type="flex">
            <el-col>
              <editor v-model="currentValue.mock.json" ref="mockJsonEditor" width="300"></editor>
            </el-col>
            <el-col>
              <el-tooltip effect="light" content="Zoom" placement="right" style="display: block;">
                <el-button icon="el-icon-full-screen" circle size="large" @click="$refs.mockJsonEditor.fullscreen()"></el-button>
              </el-tooltip>
              <el-tooltip effect="light" content="Format" placement="right" style="display: block; margin-left: 0; margin-top: 10px;">
                <el-button icon="el-icon-magic-stick" circle size="large" @click="currentValue.mock.json = $refs.mockJsonEditor.format(currentValue.mock.json)"></el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
      </template>
      <template v-if="currentValue.mock.type === 'jsonFile'">
        <el-form-item label="MockData" prop="mock.jsonPath" required>
          <el-input v-model="currentValue.mock.jsonPath"></el-input>
        </el-form-item>
      </template>
      <template v-if="currentValue.mock.type === 'Function'">
        <el-form-item label="MockData" prop="mock.handler" required>
          <el-input type="textarea" v-model="currentValue.mock.handler"></el-input>
        </el-form-item>
      </template>
    </el-form>
<!--      LocationType === 'proxyPass'-->
    <el-form :model="proxyPassScope" :key="`location-${currentValue.id}-proxyPass-form`" :ref="`location-${currentValue.id}-proxyPass`" v-if="currentValue.type === 'proxyPass' || (currentValue.type === 'mock' && currentValue.mock.type === 'proxyPass')" label-width="100px">
      <el-form-item label="Target" prop="target" required>
        <el-input v-model="proxyPassScope.target" placeholder="Please input the target of proxyPass."></el-input>
      </el-form-item>
      <el-form-item label="ChangeOrigin">
        <el-switch v-model="proxyPassScope.changeOrigin"></el-switch>
      </el-form-item>
      <el-form-item label="WebSocket">
        <el-switch v-model="proxyPassScope.ws"></el-switch>
      </el-form-item>
      <el-form-item label="PathRewrite">
        <el-button icon="el-icon-plus" circle plain v-show="!proxyPassScope.pathRewrite.length" @click="addPathRewrite(proxyPassScope.pathRewrite)"></el-button>
        <el-row type="flex" :gutter="10" v-for="(pathRewriteRow, pathRewriteIndex) in proxyPassScope.pathRewrite" :key="pathRewriteIndex" style="margin-bottom: 5px;">
          <el-col :span="8">
            <el-input size="mini" v-model="pathRewriteRow[0]"></el-input>
          </el-col>
          <el-col :span="2" class="tac">
            <span>-></span>
          </el-col>
          <el-col :span="8">
            <el-input size="mini" v-model="pathRewriteRow[1]"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="deletePathRewrite(proxyPassScope.pathRewrite, pathRewriteIndex)"></el-button>
            <el-button size="mini" icon="el-icon-plus" circle plain v-show="pathRewriteIndex === proxyPassScope.pathRewrite.length - 1" @click="addPathRewrite(proxyPassScope.pathRewrite)"></el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="Router">
        <el-button icon="el-icon-plus" circle plain v-show="!proxyPassScope.router.length" @click="addRouter(proxyPassScope.router)"></el-button>
        <el-row type="flex" :gutter="10" v-for="(routerRow, routerIndex) in proxyPassScope.router" :key="routerIndex" style="margin-bottom: 5px;">
          <el-col :span="8">
            <el-input size="mini" v-model="routerRow[0]"></el-input>
          </el-col>
          <el-col :span="2" class="tac">
            <span>-></span>
          </el-col>
          <el-col :span="8">
            <el-input size="mini" v-model="routerRow[1]"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="deleteRouter(proxyPassScope.router, routerIndex)"></el-button>
            <el-button size="mini" icon="el-icon-plus" circle plain v-show="routerIndex === proxyPassScope.router.length - 1" @click="addRouter(proxyPassScope.router)"></el-button>
          </el-col>
        </el-row>
      </el-form-item>
<!--        拦截器-->
      <el-form-item label="Interceptor">
        <div v-for="interceptor in proxyPassScope.interceptors.response.concat(proxyPassScope.interceptors.request).sort(interceptorSort)" :key="interceptor.id">
          <el-popover trigger="hover" width="600" placement="right">
            <div slot="reference" class="dib">
              <span>{{ interceptor.name }}</span>
              <el-tag :type="interceptor.type === 'request' ? 'success' : 'primary'" style="margin-left: 10px;">{{ interceptor.type === 'request' ? 'REQ' : 'RES' }}</el-tag>
              <el-button type="text" icon="el-icon-edit-outline" style="margin-left: 10px;" @click="editInterceptor(interceptor.id, interceptor.type)"></el-button>
              <el-button type="text" icon="el-icon-delete" @click="deleteInterceptor(interceptor.id, interceptor.type)"></el-button>
            </div>
            <pre>async function (body, headers) {<br>  {{ interceptor.handler }}<br>}</pre>
          </el-popover>
        </div>
        <el-button icon="el-icon-plus" circle plain @click="addInterceptor(proxyPassScope.interceptors)"></el-button>
      </el-form-item>
    </el-form>
    <el-form :key="`location-${currentValue.id}-static-form`" :ref="`location-${currentValue.id}-static`" v-if="currentValue.type === 'static'" label-width="100px" :model="currentValue.static">
      <el-form-item label="Path" prop="path" required>
        <el-input v-model="currentValue.static.path"></el-input>
      </el-form-item>
    </el-form>
<!--      <el-form-item label="Actions">-->
<!--        <el-button type="danger" @click="deleteSelf" size="small">Delete</el-button>-->
<!--      </el-form-item>-->
<!--      高级ProxyPass设置-->
    <el-form :key="`location-${currentValue.id}-advanced-form`" :ref="`location-${currentValue.id}-advanced`" label-width="100px">
      <el-form-item label="ShowAdvanced">
        <el-switch v-model="showAdvanced"></el-switch>
      </el-form-item>
      <template v-if="showAdvanced">
        <template v-if="currentValue.type === 'proxyPass'">
          <el-form-item label="Secure">
            <el-switch v-model="proxyPassScope.secure"></el-switch>
          </el-form-item>
        </template>
      </template>
    </el-form>
<!--      拦截器的Dialog-->
    <interceptor-dialog v-model="showInterceptorDialog" :interceptors="proxyPassScope.interceptors" :is-add="isAddInterceptor" @change="updateInterceptors" :interceptor-id="currentEditInterceptorId" @edit="editInterceptorInfo"></interceptor-dialog>
  </div>
</template>

<script>
import { defaultLocationProxyPassOption, defaultLocationStaticOption, defaultLocationMockOption } from '../../../server/commonUtils/options'
import InterceptorDialog from './interceptorDialog'
import editor from '@/components/Common/jsonEditor.vue'
import config from '@/config'
import { traverseFlatObject } from '@/utils'
export default {
  name: 'LocationContent',
  props: {
    isAdd: {
      type: Boolean,
      default: false
    },
    value: {
      default: () => ({}),
      type: Object
    }
  },
  data () {
    return {
      currentValue: this.value,
      isEdit: false,
      showAdvanced: false,
      showInterceptorDialog: false,
      isAddInterceptor: true,
      currentEditInterceptorId: '',
      locationTypes: config.locationTypes
    }
  },
  created () {
    if (this.isAdd) {
      this.onTypeChange(this.currentValue.type)
    }
    // this.mergeLocation()
  },
  methods: {
    // mergeLocation () {
    //   if (!this.location.proxyPass.interceptors) {
    //
    //   }
    // },
    clearValidate () {
      const refs = this.formRefs
      for (const ref of refs) {
        if (this.$refs[ref]) {
          this.$refs[ref].clearValidate()
        }
      }
    },
    deleteSelf () {
      this.$confirm('Are you sure to delete this Location?', 'Confirm', {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm'
      }).then(() => {
        this.$emit('delete')
      })
    },
    clearOptions () {
      this.$set(this.currentValue, 'proxyPass', defaultLocationProxyPassOption())
      this.$set(this.currentValue, 'mock', defaultLocationMockOption())
      this.$set(this.currentValue, 'static', defaultLocationStaticOption())
    },
    onTypeChange (val, isInit) {
      this.clearOptions()
      switch (val) {
        case 'proxyPass': this.$set(this.currentValue, 'proxyPass', defaultLocationProxyPassOption()); break
        case 'static': this.$set(this.currentValue, 'static', defaultLocationStaticOption()); break
        case 'mock': this.$set(this.currentValue, 'mock', defaultLocationMockOption()); break
      }
    },
    addPathRewrite (pathRewrite) {
      (pathRewrite || []).push(['', ''])
    },
    deletePathRewrite (pathRewrite, index) {
      pathRewrite.splice(index, 1)
    },
    addRouter (router) {
      (router || []).push(['', ''])
    },
    addInterceptor () {
      this.isAddInterceptor = true
      this.showInterceptorDialog = true
    },
    deleteRouter (router, index) {
      router.splice(index, 1)
    },
    updateInterceptors (interceptors) {
      this.$set(this.proxyPassScope, 'interceptors', interceptors)
    },
    interceptorSort (item1, item2) {
      return item1.type === 'request' && item2.type === 'response'
    },
    deleteInterceptor (id, type) {
      const interceptorItem = this.proxyPassScope.interceptors[type].find(item => item.id === id)
      this.$confirm(`Are you sure to delete interceptor "${interceptorItem.name}" ?`, 'Are you sure', {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm'
      }).then(res => {
        this.proxyPassScope.interceptors[type].splice(
          this.proxyPassScope.interceptors[type].indexOf(interceptorItem),
          1
        )
        this.$message.success(`Interceptor "${interceptorItem.name}" deleted success.`)
      })
    },
    editInterceptor (id, type) {
      const interceptorItem = this.proxyPassScope.interceptors[type].find(item => item.id === id)
      this.isAddInterceptor = false
      this.showInterceptorDialog = true
      this.currentEditInterceptorId = interceptorItem.id
    },
    editInterceptorInfo (interceptor) {
      const interceptorIndex = this.proxyPassScope.interceptors[interceptor.type].findIndex(item => item.id === interceptor.id)
      this.$set(this.proxyPassScope.interceptors[interceptor.type], interceptorIndex, interceptor)
    },
    validateSingle (formRef) {
      return new Promise((resolve) => {
        formRef.validate((result) => {
          resolve(result)
        })
      })
    },
    async validate () {
      for (const ref of this.formRefs) {
        if (this.$refs[ref]) {
          if (!await this.validateSingle(this.$refs[ref])) {
            this.$message({
              type: 'error',
              message: 'Please complete the form first.'
            })
            return false
          }
        }
      }
      return true
    }
  },
  computed: {
    proxyPassScope () {
      if (this.currentValue.type === 'mock' && this.currentValue.mock.type === 'proxyPass') {
        return this.currentValue.mock.proxyPass || {}
      } else {
        return this.currentValue.proxyPass || {}
      }
    },
    formValidateData () {
      // 拍扁Object，用来给Form的prop用，Form的prop没法校验多级
      return {
        ...traverseFlatObject({}, this.currentValue, ''),
        ...traverseFlatObject({}, this.proxyPassScope, 'proxyPassScope')
      }
    },
    formRefs () {
      const id = (this.currentValue && this.currentValue.id) || 0
      return [`location-${id}`, `location-${id}-mock`, `location-${id}-proxyPass`, `location-${id}-static`]
    }
  },
  watch: {
    'currentValue.type' (val) {
      this.onTypeChange(val)
    },
    proxyPassScope: {
      deep: true,
      handler () {
        // this.mergeLocation()
      }
    },
    value (val) {
      this.currentValue = val
    },
    currentValue (val) {
      this.$emit('input', val)
    }
  },
  components: {
    InterceptorDialog,
    editor
  }
}
</script>

<style lang="scss">
  .location-content {
    padding: 0 60px 0 20px;
  }
</style>
