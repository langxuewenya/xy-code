<template>
  <el-dialog title="版本升级" v-model="dialogVisible" @close="dialogFormVisible" :close-on-click-modal="false"
    :close-on-press-escape="false">
    <!--form表单-->
    <el-form size="small" ref="form" :model="form" :label-width="formLabelWidth">
      <el-form-item label="android版本号" prop="version_android">
        <el-input v-model="form.version_android" placeholder="请输入android版本号"></el-input>
      </el-form-item>
      <el-form-item label="ios版本号" prop="version_ios">
        <el-input v-model="form.version_ios" placeholder="请输入ios版本号"></el-input>
      </el-form-item>
      <el-form-item label="热更新包下载地址" prop="wgt_url">
        <el-input v-model="form.wgt_url"></el-input>
      </el-form-item>
      <el-form-item label="安卓整包升级地址" prop="pkg_url_android">
        <el-input v-model="form.pkg_url_android"></el-input>
      </el-form-item>
      <el-form-item label="ios整包升级地址" prop="pkg_url_ios">
        <el-input v-model="form.pkg_url_ios"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  import AppSettingApi from '@/api/appsetting.js';
  export default {
    data() {
      return {
        /*左边长度*/
        formLabelWidth: '120px',
        /*是否显示*/
        loading: false,
        /*是否显示*/
        dialogVisible: false,
        /*form表单对象*/
        form: {
          version_android: '',
          version_ios: '',
          wgt_url: '',
          pkg_url_android: '',
          pkg_url_ios: '',
        },
      };
    },
    props: ['open'],
    watch: {
      open: function(n, o) {
        if (n != o) {
          this.dialogVisible = this.open;
        }
      }
    },
    created() {},
    methods: {
      /*添加*/
      onSubmit() {
        let self = this;
        self.loading = true;
        let params = self.form;
        AppSettingApi.addAppUpdate(params, true)
          .then(data => {
            self.loading = false;
            ElMessage({
              message: '恭喜你，添加成功',
              type: 'success'
            });
            self.dialogFormVisible(true);
          })
          .catch(error => {
            self.loading = false;
          });
      },

      /*关闭弹窗*/
      dialogFormVisible(e) {
        if (e) {
          this.$emit('close', {
            type: 'success',
            openDialog: false
          });
        } else {
          this.$emit('close', {
            type: 'error',
            openDialog: false
          });
        }
      }
    }
  };
</script>

<style></style>
