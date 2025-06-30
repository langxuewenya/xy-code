<template>

  <div class="common-seach-wrap">
    <el-tabs v-model="activeName">
      <el-tab-pane label="拼团列表" name="first"><Assemble v-if="activeName == 'first'"></Assemble></el-tab-pane>
      <el-tab-pane label="基础设置" name="third"><getSetting v-if="activeName == 'third'"></getSetting></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Assemble from './assemble/index.vue';
import getSetting from './setting/getSetting.vue';
export default {
  components: {
    /*拼团列表*/
    Assemble,
    /*基础设置*/
    getSetting
  },
  data() {
    return {
      /*是否加载完成*/
      loading: true,
      form: {
        status: 0
      },
      activeName: 'first'
    };
  },
  methods: {}
};
</script>

<style></style>
