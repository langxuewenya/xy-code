<template>

  <div class="product-add">
    <!--form表单-->
    <el-form size="small" ref="form" :model="form" label-width="250px">
      <!--公众号设置-->
      <div class="common-form">公众号设置</div>
      <el-form-item label="AppID 公众号ID">
        <el-input v-model="form.mpapp_id" class="max-w460"></el-input>
      </el-form-item>
      <el-form-item label="AppSecret 公众号密钥">
        <el-input v-model="form.mpapp_secret" type="password" class="max-w460"></el-input>
      </el-form-item>

      <!--提交-->
      <div class="common-button-wrapper">
          <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </el-form>


  </div>

</template>

<script>
  import AppSettingApi from '@/api/appsetting.js';

  export default {
    data() {
      return {
        /*切换菜单*/
        // activeIndex: '1',
        /*form表单数据*/
        form: {
        },


      };
    },
    created() {
      this.getData()
    },

    methods: {
      
      /*获取数据*/
      getData() {
        let self = this;
        AppSettingApi.appmpDetail({}, true)
          .then(data => {
            if(data.data.data != null){
              self.form = data.data.data;
            }
          })
          .catch(error => {});

      },
      
      /*提交表单*/
      onSubmit() {
        let self = this;
        let params = this.form;
        AppSettingApi.editAppMp(params, true)
          .then(data => {
            ElMessage({
              message: '恭喜你，设置成功',
              type: 'success'
            });
            self.$router.push('/appsetting/appmp/index');
          })
          .catch(error => {

          });
      },
    }

  };
</script>

<style>
  .tips {
    color: #ccc;
  }
</style>
