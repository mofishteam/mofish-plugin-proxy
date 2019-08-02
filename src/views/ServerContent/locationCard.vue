<template>
  <el-collapse-item :name="name">
    <div slot="title">
      <span>Location：{{ location.url }}</span>
      <el-tag size="mini" style="margin-left: 20px;">{{ location.type }}</el-tag>
      <el-tag size="mini" type="info" style="margin-left: 20px;" v-show="isAdd">new</el-tag>
    </div>
    <el-form :ref="`location-${location.id}`" :model="location" label-width="100px">
      <el-form-item label="Location">
        <el-input v-model="location.url" placeholder="Please input location url."></el-input>
      </el-form-item>
      <el-form-item label="Type">
        <el-radio-group v-model="location.type" size="small">
          <el-radio-button label="proxyPass">ProxyPass</el-radio-button>
          <el-radio-button label="static">Static</el-radio-button>
          <el-radio-button label="mock">Mock</el-radio-button>
          <!--                      <el-radio-button label="alias"></el-radio-button>-->
        </el-radio-group>
      </el-form-item>
      <template v-if="location.type === 'mock'">
        <el-form-item label="Method">
          <el-radio-group v-model="location.mock.method" size="small">
            <el-radio-button label="all">ALL</el-radio-button>
            <el-radio-button label="get">GET</el-radio-button>
            <el-radio-button label="post">POST</el-radio-button>
            <el-radio-button label="put">PUT</el-radio-button>
            <el-radio-button label="delete">DELETE</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="MockType">
          <el-radio-group v-model="location.mock.type" size="small">
            <el-radio-button label="json">JSON</el-radio-button>
<!--            <el-radio-button label="jsonFile">JSONFile</el-radio-button>-->
<!--            <el-radio-button label="function">Function</el-radio-button>-->
<!--            <el-radio-button label="proxyPass">ProxyPass</el-radio-button>-->
          </el-radio-group>
        </el-form-item>
        <template v-if="location.mock.type === 'json'">
          <el-form-item label="MockData">
            <el-input type="textarea" v-model="location.mock.json"></el-input>
          </el-form-item>
        </template>
        <template v-if="location.mock.type === 'jsonFile'">
          <el-form-item label="MockData">
            <el-input v-model="location.mock.jsonPath"></el-input>
          </el-form-item>
        </template>
        <template v-if="location.mock.type === 'Function'">
          <el-form-item label="MockData">
            <el-input type="textarea" v-model="location.mock.handler"></el-input>
          </el-form-item>
        </template>
      </template>
      <template v-if="location.type === 'proxyPass' || (location.type === 'mock' && location.mock.type === 'proxyPass')">
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
              <el-button size="small" type="danger" icon="el-icon-delete" circle @click="deletePathRewrite(proxyPassScope.pathRewrite, pathRewriteIndex)"></el-button>
              <el-button size="small" icon="el-icon-plus" circle plain v-show="pathRewriteIndex === proxyPassScope.pathRewrite.length - 1" @click="addPathRewrite(proxyPassScope.pathRewrite)"></el-button>
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
              <el-button size="small" type="danger" icon="el-icon-delete" circle @click="deleteRouter(proxyPassScope.router, routerIndex)"></el-button>
              <el-button size="small" icon="el-icon-plus" circle plain v-show="routerIndex === proxyPassScope.router.length - 1" @click="addRouter(proxyPassScope.router)"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </template>
      <template v-if="location.type === 'static'">
        <el-form-item label="Path">
          <el-input v-model="location.static.path"></el-input>
        </el-form-item>
      </template>
      <el-form-item label="Actions">
        <el-button type="danger" @click="deleteSelf" size="small">Delete</el-button>
      </el-form-item>
      <el-form-item label="ShowAdvanced">
        <el-switch v-model="showAdvanced"></el-switch>
      </el-form-item>
      <template v-if="showAdvanced">
        <template v-if="location.type === 'proxyPass'">
          <el-form-item label="Secure">
            <el-switch v-model="proxyPassScope.secure"></el-switch>
          </el-form-item>
        </template>
      </template>
    </el-form>
  </el-collapse-item>
</template>

<script>
import { defaultLocationProxyPassOption, defaultLocationStaticOption, defaultLocationMockOption } from '../../../server/commonUtils/options'
export default {
  name: 'LocationCard',
  props: {
    location: {
      type: Object,
      default: () => ({})
    },
    isAdd: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isEdit: false,
      showAdvanced: false
    }
  },
  created () {
    if (this.isAdd) {
      this.onTypeChange(this.location.type)
    }
  },
  methods: {
    deleteSelf () {
      this.$confirm('Are you sure to delete this Location?', 'Confirm').then(() => {
        this.$emit('delete')
      })
    },
    clearOptions () {
      this.$set(this.location, 'proxyPass', defaultLocationProxyPassOption())
      this.$set(this.location, 'mock', defaultLocationMockOption())
      this.$set(this.location, 'static', defaultLocationStaticOption())
    },
    onTypeChange (val, isInit) {
      this.clearOptions()
      switch (val) {
        case 'proxyPass': this.$set(this.location, 'proxyPass', defaultLocationProxyPassOption()); break
        case 'static': this.$set(this.location, 'static', defaultLocationStaticOption()); break
        case 'mock': this.$set(this.location, 'mock', defaultLocationMockOption()); break
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
    deleteRouter (router, index) {
      router.splice(index, 1)
    }
  },
  computed: {
    proxyPassScope () {
      if (this.location.type === 'mock' && this.location.mock.type === 'proxyPass') {
        return this.location.mock.proxyPass
      } else {
        return this.location.proxyPass
      }
    }
  },
  watch: {
    'location.type' (val) {
      this.onTypeChange(val)
    }
  }
}
</script>
