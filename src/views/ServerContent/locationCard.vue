<template>
  <el-card shadow="hover">
    <div slot="header" class="clearfix">
      <el-input v-if="isAdd || isEdit" v-model="location.url" style="width: calc(100% - 80px);"></el-input>
      <span v-if="!isAdd && !isEdit">{{ location.url }}</span>
      <el-button v-if="!isAdd && !isEdit" type="text" icon="el-icon-edit-outline" style="margin-left: 5px;" @click="isEdit = true"></el-button>
      <el-button v-if="isAdd || isEdit" type="text" icon="el-icon-check" style="margin-left: 5px;" @click="isEdit = false"></el-button>
      <el-button style="float: right;" type="danger" icon="el-icon-delete" circle></el-button>
    </div>
    <el-form :ref="`location-${location.id}`" :model="location" label-width="60px">
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
      </template>
    </el-form>
  </el-card>
</template>

<script>
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
    }
  },
  data () {
    return {
      isEdit: false
    }
  }
}
</script>
