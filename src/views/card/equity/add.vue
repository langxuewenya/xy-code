<template>
	<div class="product-add">
		<!--form表单-->
		<el-form size="small" ref="form" :model="form" label-width="180px">
			<el-form-item label="名称：" :rules="[{ required: true, message: '请填写名称' }]" prop="name">
				<el-input v-model="form.name" class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="图片：" prop="image" :rules="[{ required: true, message: '请上传图片' }]">
				<div class="d-s-c f-w maxwidth-530">
					<div class="img" @click="openUpload()">
						<img v-img-url="form.image" width="80" height="80" />
					</div>
					<div class="gray9">建议上传图片尺寸比例为80:80</div>
				</div>
			</el-form-item>
			<!-- <el-form-item label="描述：" prop="describe">
				<el-input v-model="form.describe" class="max-w460"></el-input>
			</el-form-item> -->
			<el-form-item label="排序：" :rules="[{ required: true, message: '请填写排序' }]" prop="sort">
				<el-input v-model="form.sort" class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="状态：">
				<el-radio-group v-model="form.status">
					<el-radio :value="0">关闭</el-radio>
					<el-radio :value="1">开启</el-radio>
				</el-radio-group>
			</el-form-item>
			<!--提交-->
			<div class="common-button-wrapper">
				<el-button size="small" type="info" @click="cancelFunc">取消</el-button>
				<el-button size="small" type="primary" @click="onSubmit" :loading="loading">提交</el-button>
			</div>
		</el-form>
		<!--上传图片组件-->
		<Upload v-if="isupload" :isupload="isupload" :config="config" @returnImgs="returnImgsFunc">上传图片</Upload>
	</div>
</template>
<script>
	import CardApi from '@/api/card.js';
	import Upload from '@/components/file/Upload.vue';
	export default {
		components: {
			Upload,
		},
		data() {
			return {
				/*是否正在加载*/
				loading: false,
				/*form表单数据*/
				form: {
					name: '',
					image: '',
					status: 1,
					sort: '',
				},
				config: {},
				isupload: false,
			};
		},
		created() {},
		methods: {
			/*提交*/
			onSubmit: function() {
				let self = this;
				let params = self.form;
				self.$refs.form.validate(valid => {
					if (valid) {
						self.loading = true;
						CardApi.addequity(params, true)
							.then(data => {
								self.loading = false;
								ElMessage({
									message: '添加成功',
									type: 'success'
								});
								self.$router.push('/card/equity/index');
							})
							.catch(error => {
								self.loading = false;
							});
					} else {
						ElMessage({
							message: '请检查必填项是否填写完整',
							type: 'error'
						});
					}
				});
			},

			/*取消*/
			cancelFunc() {
				this.$router.back(-1);
			},
			/*上传*/
			openUpload(e) {
				this.config = {
				  total: 1,
				  file_type: 'image'
				};
				this.isupload = true;
			},
			/*获取图片*/
			returnImgsFunc(e) {
				if (e != null && e.length > 0) {
					this.form.image = e[0].file_path;
				}
				this.isupload = false;
			},
		}
	};
</script>

<style lang="scss" scoped>
	.basic-setting-content {}

	.product-add {
		padding-bottom: 100px;
	}
</style>