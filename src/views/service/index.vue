<template>

  <div class="user">
    <div class="common-seach-wrap">
      <el-tabs v-model="activeName">
        <el-tab-pane label="消息管理" name="service">
          <ServiceIndex v-if="activeName=='service'"></ServiceIndex>
        </el-tab-pane>
        <el-tab-pane label="分类管理" name="category">
          <CategoryIndex v-if="activeName=='category'"></CategoryIndex>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import ServiceIndex from './service/Index.vue';
  import CategoryIndex from './category/Index.vue';
  export default {
    components: {
      ServiceIndex,
      CategoryIndex,
    },
    data() {
      return {
        activeName: 'service',
        /*是否加载完成*/
        loading: true,
      }
    },
    created() {


    },
    methods: {}
  }
</script>
