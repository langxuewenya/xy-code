<template>

  <div class="common-seach-wrap">
    <el-tabs v-model="activeName">
      <el-tab-pane label="积分设置" name="first"></el-tab-pane>
      <el-tab-pane label="积分明细" name="second"></el-tab-pane>
    </el-tabs>

    <!--积分设置-->
    <Setting v-if="activeName == 'first'"></Setting>
    <!--积分明细-->
    <Log v-if="activeName == 'second'"></Log>
    
  </div>
</template>
<script>
import Setting from './part/Setting.vue';
import Log from './part/Log.vue';
export default {
  components: {
    Setting,
    Log
  },
  data() {
    return {
      form: {
        status: 0
      },
      activeName: 'first'
    };
  },
  methods: {}
};
</script>

<style>

</style>
