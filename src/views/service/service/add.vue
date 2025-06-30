<template>

  <div class="product-add pb50">
    <!--添加文章-->
    <el-form size="small" :model="form" ref="form" :rules="rules" label-width="100px">
      <div class="common-form">添加消息</div>
      <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '请填写标题' }]">
        <el-input v-model="form.title" placeholder="请输入标题" class="max-w460"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="category_id" :rules="[{ required: true, message: '请选择分类' }]">
        <el-select v-model="form.category_id" placeholder="请选择">
          <el-option v-for="(item, index) in catgory" :key="index" :label="item.name" :value="item.category_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="内容" prop="content" :rules="[{ required: true, message: '请输入内容' }]">
        <el-input v-model="form.content" placeholder="请输入内容" class="max-w460" type="textarea" rows="10" cols="20">
        </el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input type="number" v-model="form.sort" placeholder="请输入数字" class="max-w460"></el-input>
      </el-form-item>
      <!--提交-->
      <div class="common-button-wrapper">
        <el-button size="small" type="info" @click="cancelFunc">取消</el-button>
        <el-button size="small" type="primary" @click="onSubmit" :loading="loading">提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import ServiceApi from '@/api/service.js';
  import Upload from '@/components/file/Upload.vue';
  export default {
    components: {
      /*图片上传*/
      Upload: Upload
    },
    data() {
      return {
        /*是否上传图片*/
        isupload: false,
        isImg: false,
        path: '',
        /*form表单数据*/
        form: {
          title: '',
          category_id: '',
          sort: 1,
          content: '',
          status: 1,
        },
        /*分类*/
        catgory: [],
        loading: false,
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
      /*获取列表*/
      this.getCategoryList();
    },
    methods: {
      /*上传*/
      openUpload() {
        this.isupload = true;
      },

      /*获取图片*/
      returnImgsFunc(e) {
        let self = this;
        if (e != null) {
          this.form.image_id = e[0].file_id;
          this.path = e[0].file_path;
          this.isImg = true;
        }
        this.isupload = false;
      },

      /*获取文章类别*/
      getCategoryList() {
        let self = this;
        let Params = {};

        ServiceApi.toAddService(Params, true)
          .then(res => {
            self.catgory = res.data.catgory;
            if (self.catgory.length > 0) {
              self.form.category_id = self.catgory[0].category_id;
            }
          })
          .catch(error => {

          });
      },

      /*添加文章*/
      onSubmit() {
        let self = this;
        let form = self.form;
        self.$refs.form.validate(valid => {
          if (valid) {
            self.loading = true;
            ServiceApi.addService(form, true)
              .then(data => {
                self.loading = false;
                ElMessage({
                  message: data.msg,
                  type: 'success'
                });
                self.$router.push('/service/index');
              })
              .catch(error => {
                self.loading = false;
              });
          }
        });
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
