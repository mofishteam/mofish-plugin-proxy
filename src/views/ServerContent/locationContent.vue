<template>
  <div class="location-content">
    <el-form :ref="`location-${currentValue.id}`" :model="currentValue" label-width="100px">
      <el-form-item label="Location">
        <el-input v-model="currentValue.url" placeholder="Please input location url."></el-input>
      </el-form-item>
      <el-form-item>
        <span slot="label" class="text-danger">Close</span>
        <el-switch active-color="#ff4949" v-model="currentValue.isClose"></el-switch>
      </el-form-item>
      <el-form-item label="Delay">
        <el-input style="width: 100px;" placeholder="0" v-model="currentValue.delay">
          <span slot="suffix">ms</span>
        </el-input>
      </el-form-item>
      <el-form-item label="Type">
        <el-radio-group v-model="currentValue.type" size="small">
          <el-radio-button label="proxyPass">ProxyPass</el-radio-button>
          <el-radio-button label="static">Static</el-radio-button>
          <el-radio-button label="mock">Mock</el-radio-button>
          <!--                      <el-radio-button label="alias"></el-radio-button>-->
        </el-radio-group>
      </el-form-item>
      <template v-if="currentValue.type === 'mock'">
        <el-form-item label="Method">
          <el-radio-group v-model="currentValue.mock.method" size="small">
            <el-radio-button label="all">ALL</el-radio-button>
            <el-radio-button label="get">GET</el-radio-button>
            <el-radio-button label="post">POST</el-radio-button>
            <el-radio-button label="put">PUT</el-radio-button>
            <el-radio-button label="delete">DELETE</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="MockType">
          <el-radio-group v-model="currentValue.mock.type" size="small">
            <el-radio-button label="json">JSON</el-radio-button>
            <!--            <el-radio-button label="jsonFile">JSONFile</el-radio-button>-->
            <!--            <el-radio-button label="function">Function</el-radio-button>-->
            <!--            <el-radio-button label="proxyPass">ProxyPass</el-radio-button>-->
          </el-radio-group>
        </el-form-item>
        <template v-if="currentValue.mock.type === 'json'">
          <el-form-item label="MockData">
            <el-row :gutter="10" type="flex">
              <el-col>
                <editor v-model="currentValue.mock.json" ref="mockJsonEditor"></editor>
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
          <el-form-item label="MockData">
            <el-input v-model="currentValue.mock.jsonPath"></el-input>
          </el-form-item>
        </template>
        <template v-if="currentValue.mock.type === 'Function'">
          <el-form-item label="MockData">
            <el-input type="textarea" v-model="currentValue.mock.handler"></el-input>
          </el-form-item>
        </template>
      </template>
      <template v-if="currentValue.type === 'proxyPass' || (currentValue.type === 'mock' && currentValue.mock.type === 'proxyPass')">
        <el-form-item label="Target">
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
            <el-col :span="9">
              <el-input v-model="pathRewriteRow[0]"></el-input>
            </el-col>
            <el-col :span="2" class="tac">
              <span>-></span>
            </el-col>
            <el-col :span="9">
              <el-input v-model="pathRewriteRow[1]"></el-input>
            </el-col>
            <el-col :span="3">
              <el-button type="danger" icon="el-icon-delete" circle @click="deletePathRewrite(proxyPassScope.pathRewrite, pathRewriteIndex)"></el-button>
              <el-button icon="el-icon-plus" circle plain v-show="pathRewriteIndex === proxyPassScope.pathRewrite.length - 1" @click="addPathRewrite(proxyPassScope.pathRewrite)"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="Router">
          <el-button icon="el-icon-plus" circle plain v-show="!proxyPassScope.router.length" @click="addRouter(proxyPassScope.router)"></el-button>
          <el-row type="flex" :gutter="10" v-for="(routerRow, routerIndex) in proxyPassScope.router" :key="routerIndex" style="margin-bottom: 5px;">
            <el-col :span="9">
              <el-input v-model="routerRow[0]"></el-input>
            </el-col>
            <el-col :span="2" class="tac">
              <span>-></span>
            </el-col>
            <el-col :span="9">
              <el-input v-model="routerRow[1]"></el-input>
            </el-col>
            <el-col :span="3">
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteRouter(proxyPassScope.router, routerIndex)"></el-button>
              <el-button icon="el-icon-plus" circle plain v-show="routerIndex === proxyPassScope.router.length - 1" @click="addRouter(proxyPassScope.router)"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
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
      </template>
      <template v-if="currentValue.type === 'static'">
        <el-form-item label="Path">
          <el-input v-model="currentValue.static.path"></el-input>
        </el-form-item>
      </template>
      <el-form-item label="Actions">
        <el-button type="danger" @click="deleteSelf" size="small">Delete</el-button>
      </el-form-item>
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
    <interceptor-dialog v-model="showInterceptorDialog" :interceptors="proxyPassScope.interceptors" :is-add="isAddInterceptor" @change="updateInterceptors" :interceptor-id="currentEditInterceptorId" @edit="editInterceptorInfo"></interceptor-dialog>
  </div>
</template>

<script>
import { defaultLocationProxyPassOption, defaultLocationStaticOption, defaultLocationMockOption } from '../../../server/commonUtils/options'
import InterceptorDialog from './interceptorDialog'
import editor from '@/components/Common/jsonEditor.vue'
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
      currentEditInterceptorId: ''
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
    }
  },
  computed: {
    proxyPassScope () {
      if (this.currentValue.type === 'mock' && this.currentValue.mock.type === 'proxyPass') {
        return this.currentValue.mock.proxyPass
      } else {
        return this.currentValue.proxyPass
      }
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
