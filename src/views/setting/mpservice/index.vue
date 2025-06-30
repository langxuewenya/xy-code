<template>

	<div>
		<!--form表单-->
		<el-form size="small" ref="formData" :model="formData" label-width="150px">
			<!--客服设置-->
			<div class="common-form">客服设置</div>
			<el-form-item label="客服类型">
				<div>
					<el-radio v-model="formData.service_type" :label="'10'">聊天工具</el-radio>
					<el-radio v-model="formData.service_type" :label="'20'"
						:disabled="formData.service_open == 0">在线客服</el-radio>
				</div>
				<div class="tips">在线客服在saas端开启后可以使用，关闭后请切换成聊天工具</div>
			</el-form-item>
			<template v-if="formData.service_type == 10">
				<el-form-item label="QQ" :rules="[{required: true,message: '请输入QQ'}]">
					<el-input type="number" v-model.trim="formData.qq" placeholder="请输入QQ" class="max-w460"></el-input>
				</el-form-item>
				<el-form-item label="微信号" :rules="[{required: true,message: '请输入微信号'}]">
					<el-input v-model.trim="formData.wechat" placeholder="请输入微信号" class="max-w460"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" :rules="[{required: true,message: '请输入联系电话'}]">
					<el-input v-model.trim="formData.phone" placeholder="请输入联系电话" class="max-w460"></el-input>
				</el-form-item>

			</template>

			<!--提交-->
			<div class="common-button-wrapper">
				<el-button size="small" type="primary" @click="onSubmit" :disabled="loading">提交</el-button>
			</div>
		</el-form>

		<!--上传图片-->
		<Upload v-if="isupload" :isupload="isupload" :config="{ total: 3 }" @returnImgs="returnImgsFunc"></Upload>
	</div>
</template>

<script>
	import SettingApi from '@/api/setting.js';
	export default {
		components: {},
		data() {
			return {
				/*是否正在加载*/
				loading: true,
				/*表单数据对象*/
				formData: {
					service_type: '',
					qq: '',
					wechat: '',
					phone: ''
				},
			};
		},
		created() {
			this.getParams();
		},
		methods: {

			/*获取配置数据*/
			getParams() {
				let self = this;
				SettingApi.getMpService({}, true).then(res => {
						if (res.code == 1) {
							self.formData = res.data.vars.values;
							self.loading = false;
						} else {
							console.log();
						}
					})
					.catch(error => {

					});
			},

			/*提交*/
			onSubmit() {
				let self = this;
				let params = this.formData;
				self.$refs.formData.validate((valid) => {
					if (valid) {
						self.loading = true;
						SettingApi.setMpService(params, true)
							.then(data => {
								self.loading = false;
								ElMessage({
									message: '恭喜你， 客服设置成功',
									type: 'success'
								});
							})
							.catch(error => {
								self.loading = false;
							});
					}
				});
			},
		}
	};
</script>

<style>
</style>