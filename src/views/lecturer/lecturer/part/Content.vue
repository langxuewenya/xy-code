<template>

  <div>
    <!--讲师详情-->
    <div class="common-form">讲师详情</div>
    <!--内容-->
    <el-form-item label="详情内容：">
      <div class="edit_container">
        <Uediter :text="form.model.content" :config="ueditor.config" @contentChange="contentChangeFunc" ref="ue"></Uediter>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import Uediter from '@/components/UE.vue';
export default {
  components: {
    /*编辑器*/
    Uediter,
  },
  data() {
    return {
      /*富文本框配置*/
      ueditor: {
        text: '',
        config: {
          initialFrameWidth: 400,
          initialFrameHeight: 500
        }
      },
      config: {
        total: 9,file_type: 'image',
      }
    };
  },
  created() {
    //this.ueditor.text = this.form.model.content;
  },
  inject: ['form'],
  methods:{

    /*获取富文本框内容*/
    getContent: function() {
      //return this.$refs.ue.getUEContent();
    },

    /*获取富文本内容*/
    contentChangeFunc(e){
      this.form.model.content=e;
    },
  }
};
</script>

<style></style>
