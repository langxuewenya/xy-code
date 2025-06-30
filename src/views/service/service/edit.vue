<template>

  <div class="product-add pb50" v-loading="loading">
    <!--编辑文章-->
    <el-form size="small" :model="form" ref="form" :rules="rules" label-width="100px">
      <div class="common-form">编辑消息</div>
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" class="max-w460"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="category_id">
        <el-select v-model="form.category_id" placeholder="请选择">
          <el-option :disabled="item.level<2" v-for="(item, index) in category" :key="index" :label="item.name" :value="item.category_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="form.content" placeholder="请输入内容" class="max-w460" type="textarea" rows="10" cols="20">
        </el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input type="number" v-model="form.sort" placeholder="请输入数字" class="max-w460"></el-input>
      </el-form-item>
      <!--提交-->
      <div class="common-button-wrapper">
        <el-button size="small" type="info" @click="cancelFunc" :loading="loading">取消</el-button>
        <el-button size="small" type="primary" @click="onSubmit" :loading="loading">提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import ServiceApi from '@/api/service.js';
  import Uediter from '@/components/UE.vue';
  import Upload from '@/components/file/Upload.vue';
  export default {
    components: {
      /*编辑器*/
      Uediter,
      /*图片上传*/
      Upload: Upload
    },
    data() {
      return {
        /*是否加载完成*/
        loading: true,
        /*是否上传图片*/
        isupload: false,
        /*富文本配置*/
        ueditor: {
          text: '',
          config: {
            initialFrameWidth: 400,
            initialFrameHeight: 500
          }
        },
        /*form表单数据*/
        form: {
          service_id: 0,
          title: '',
          category_id: '',
          sort: 1,
          content: '',
          status: 1,
        },
        /*新闻类别*/
        category: [],
        /*验证规则*/
        rules: {
          category_id: [{
            required: true,
            message: '请选择分类',
            trigger: 'blur'
          }],
          title: [{
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }],
          content: [{
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          }]
        }
      };
    },
    created() {

      this.getDetail();

    },

    methods: {

      /*上传*/
      openUpload() {
        this.isupload = true;
      },

      getContent: function() {
        return this.$refs.ue.getUEContent();
      },

      /*获取图片*/
      returnImgsFunc(e) {
        let self = this;
        if (e != null) {
          this.form.image_id = e[0].file_id;
          this.form.image.file_path = e[0].file_path;
        }
        this.isupload = false;
      },

      getDetail() {
        let self = this;
        // 取到路由带过来的参数
        const params = self.$route.query.service_id;
        ServiceApi.toEditService({
            service_id: params
          }, true).then(res => {
            self.form = res.data.detail;
            self.category = res.data.category;
            self.loading = false;
          })
          .catch(error => {});
      },

      /*修改文章*/
      onSubmit() {
        let self = this;
        let params = this.form;
        // 取到路由带过来的参数
        ServiceApi.editService(params, true)
          .then(data => {
            ElMessage({
              message: data.msg,
              type: 'success'
            });
            self.$router.push('/service/index');
          })
          .catch(error => {});
      },

      /*取消添加，返回文章列表*/
      cancelFunc() {
        this.$router.push({
          path: '/service/index'
        });
      }
    }
  };
</script>

<style>
  .edit_container {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .ql-editor {
    height: 400px;
  }
</style>
