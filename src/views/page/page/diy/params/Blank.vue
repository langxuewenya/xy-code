<template>

  <div>
    <div class="common-form">
      <span>{{ curItem.name }}</span>
    </div>
    <el-form size="small" :model="curItem" label-width="100px">
      <!-- 背景颜色 -->
      <el-form-item label="背景颜色：">
        <div class="d-s-c">
          <el-color-picker v-model="curItem.style.background"></el-color-picker>
          <el-button type="button" style="margin-left: 10px;" @click.stop="$parent.onEditorResetColor(curItem.style, 'background', '#f6f6f6')">重置</el-button>
        </div>
      </el-form-item>
      <!--组件高度-->
      <el-form-item label="组件高度：">
        <el-slider v-model="curItem.style.height" :min="1" :max='200' show-input></el-slider>
      </el-form-item>
    </el-form>
   </div>
</template>

<script>
  export default {
    data() {
      return {

      };
    },
    props: ['curItem', 'selectedIndex', 'opts'],
    created() {
      this.curItem.style.height = parseInt(this.curItem.style.height);
    },
    methods: {

    }
  };
</script>

<style>

</style>
