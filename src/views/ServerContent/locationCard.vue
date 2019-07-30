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
          <el-radio-button label="proxyPass"></el-radio-button>
          <!--                      <el-radio-button label="root"></el-radio-button>-->
          <!--                      <el-radio-button label="alias"></el-radio-button>-->
        </el-radio-group>
      </el-form-item>
      <template v-if="location.type === 'proxyPass'">
        <el-form-item label="Target">
          <el-input v-model="location.proxyPass.target" placeholder="Please input the target of proxyPass."></el-input>
        </el-form-item>
        <el-form-item label="ChangeOrigin">
          <el-switch v-model="location.proxyPass.changeOrigin"></el-switch>
        </el-form-item>
        <el-form-item label="WebSocket">
          <el-switch v-model="location.proxyPass.ws"></el-switch>
        </el-form-item>
        <el-form-item label="PathRewrite">
          <el-button icon="el-icon-plus" circle plain v-show="!location.proxyPass.pathRewrite.length" @click="addPathRewrite(location.proxyPass.pathRewrite)"></el-button>
          <el-row type="flex" :gutter="10" v-for="(pathRewriteRow, pathRewriteIndex) in location.proxyPass.pathRewrite" :key="pathRewriteIndex" style="margin-bottom: 5px;">
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
              <el-button size="small" type="danger" icon="el-icon-delete" circle @click="deletePathRewrite(location.proxyPass.pathRewrite, pathRewriteIndex)"></el-button>
              <el-button size="small" icon="el-icon-plus" circle plain v-show="pathRewriteIndex === location.proxyPass.pathRewrite.length - 1" @click="addPathRewrite(location.proxyPass.pathRewrite)"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="Router">
          <el-button icon="el-icon-plus" circle plain v-show="!location.proxyPass.router.length" @click="addRouter(location.proxyPass.router)"></el-button>
          <el-row type="flex" :gutter="10" v-for="(routerRow, routerIndex) in location.proxyPass.router" :key="routerIndex" style="margin-bottom: 5px;">
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
              <el-button size="small" type="danger" icon="el-icon-delete" circle @click="deleteRouter(location.proxyPass.router, routerIndex)"></el-button>
              <el-button size="small" icon="el-icon-plus" circle plain v-show="routerIndex === location.proxyPass.router.length - 1" @click="addRouter(location.proxyPass.router)"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </template>
      <el-form-item label="Actions">
        <el-button type="danger" @click="deleteSelf" size="small">Delete</el-button>
      </el-form-item>
    </el-form>
  </el-collapse-item>
</template>

<script>
import { defaultLocationProxyPassOption } from '../../../commonUtils/options'
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
      isEdit: false
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
      this.location.proxyPass = {}
      this.location.root = {}
      this.location.alias = {}
    },
    onTypeChange (val, isInit) {
      console.log('onTypeChange')
      this.clearOptions()
      switch (val) {
        case 'proxyPass': this.location.proxyPass = defaultLocationProxyPassOption()
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
  watch: {
    'location.type' (val) {
      this.onTypeChange(val)
    }
  }
}
</script>
