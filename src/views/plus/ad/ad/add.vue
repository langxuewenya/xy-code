<template>

  <div class="product-add pb50">
    <!--添加广告-->
    <el-form size="small" :model="form" ref="form" :rules="rules" label-width="100px">
      <div class="common-form">添加广告</div>
      <el-form-item label="广告标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入广告标题" class="max-w460"></el-input>
      </el-form-item>
      <el-form-item label="广告图" prop="image_id">
        <div>
          <el-button type="primary" @click="openUpload">上传图片</el-button>
          <img :src="path" class="mt10" :width="120" v-if="isImg" :isImg="isImg" />
          <div style="color: red;"></div>
          <!--上传图片组件-->
          <Upload v-if="isupload" :isupload="isupload" @returnImgs="returnImgsFunc">上传图片</Upload>
        </div>
      </el-form-item>
      <el-form-item label="广告状态">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序">
        <el-input type="number" v-model="form.sort" placeholder="请输入数字" class="max-w460"></el-input>
      </el-form-item>
      <el-form-item label="链接" prop="link_url">
        <div class="url-box flex-1">
          <!-- <span class="key-name">链接地址：</span> -->
          <el-input v-model="form.link_url" type="text" class="max-w460" style="width: 380px;"></el-input>

          <el-button type="primary" @click="changeLink()">选择链接</el-button>
          <div class="tips" id="tips" style="color: #000;">{{tips_Id}}</div>
          <el-input v-model="form.name" type="hidden" class="max-w460" style="width: 380px;"></el-input>
        </div>
        <div class="url-box ml10" style="float: right;">

        </div>
      </el-form-item>
      <Setlink v-if="is_linkset" :is_linkset="is_linkset" @closeDialog="closeLinkset">选择链接</Setlink>
      <!--提交-->
      <div class="common-button-wrapper">
        <el-button size="small" type="info" @click="cancelFunc">取消</el-button>
        <el-button size="small" type="primary" @click="onSubmit" :loading="loading">提交</el-button>

      </div>
    </el-form>
  </div>
</template>

<script>
  import AdApi from '@/api/ad.js';
  import Upload from '@/components/file/Upload.vue';
  import Setlink from '@/components/setlink/Setlink.vue';
  export default {
    components: {
      /*图片上传*/
      Upload: Upload,
      Setlink
    },
    data() {
      return {
        /*是否上传图片*/
        isupload: false,
        is_linkset: false,
        isImg: false,
        path: '',
        tips_Id: '',
        /*form表单数据*/
        form: {
          title: '',
          category_id: '',
          image_id: '',
          sort: 1,
          status: 1,
          link_url: '',
          name: '',
          background: ''
        },
        /*广告类别*/
        catgory: [],
        loading: false,
        /*验证规则*/
        rules: {
          title: [{
            required: true,
            message: '请输入广告标题',
            trigger: 'blur'
          }],
		  image_id: [{
		    required: true,
		    message: '请上传图片',
		    trigger: 'blur'
		  }],

        }
      };
    },
    created() {
      /*获取列表*/
      this.getCategoryList();
    },
    methods: {
      /*选择链接*/
      changeLink() {
        this.is_linkset = true;
      },

      /*获取链接并关闭弹窗*/
      closeLinkset(e) {
        //console.log(e);
        this.is_linkset = false;
        if (e != null) {
          this.form.link_url = e.url;
          this.form.name = '链接到' + ' ' + e.type + ' ' + e.name;
          this.tips_Id = '链接到' + ' ' + e.type + ' ' + e.name;
        }

      },
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

      /*获取广告类别*/
      getCategoryList() {
        let self = this;
        let Params = {};

        AdApi.toaddAd(Params, true)
          .then(res => {
            self.catgory = res.data.catgory;
            if (self.catgory.length > 0) {
              self.form.category_id = self.catgory[0].category_id;
            }
          })
          .catch(error => {

          });
      },

      /*添加广告*/
      onSubmit() {
        let self = this;
        let form = self.form;
        self.$refs.form.validate(valid => {
          if (valid) {
            self.loading = true;
            AdApi.addAd(form, true)
              .then(data => {
                self.loading = false;
                ElMessage({
                  message: data.msg,
                  type: 'success'
                });
                self.$router.push('/plus/ad/ad/index');
              })
              .catch(error => {
                self.loading = false;
              });
          }
        });
      },

      /*取消添加，返回广告列表*/
      cancelFunc() {
        this.$router.push({
          path: '/plus/ad/index'
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
