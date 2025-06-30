<template>
	<div class="product-add" v-loading="loading">
		<!--form表单-->
		<el-form size="small" ref="form" :model="form" label-width="180px" v-if="!loading">
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
				<el-button size="small" type="primary" @click="onSubmit" :disabled="save_loading">提交</el-button>
			</div>
		</el-form>
		<!--上传图片组件-->
		<Upload v-if="isupload" :isupload="isupload" :config="config" @returnImgs="returnImgsFunc">上传图片</Upload>
	</div>
</template>

<script>
	import CardApi from '@/api/card.js';
	import Upload from '@/components/file/Upload.vue';
	import {
		formatModel
	} from '@/utils/base.js';
	export default {
		components: {
			Upload,
		},
		data() {
			return {
				/*ID*/
				equity_id: 0,
				/*是否正在加载*/
				loading: true,
				/*是否正在提交保存*/
				save_loading: false,
				/*form表单数据*/
				form: {
					equity_id: 0,
					name: '',
					image: '',
					status: 1,
					sort: '',
				},
				config: {},
				isupload: false,
			};
		},
		provide: function() {
			return {
				form: this.form
			};
		},
		created() {
			/*获取列表*/
			this.equity_id = this.$route.query.equity_id;
			this.getData();

		},
		methods: {
			/**
			 * 获取基础数据
			 */
			getData: function() {
				let self = this;
				CardApi.equityDetail({
							equity_id: self.equity_id,
						},
						true
					)
					.then(res => {
						self.loading = false;
						Object.assign(self.form, res.data.model);
					})
					.catch(error => {
						self.loading = false;
					});
			},

			/*提交*/
			onSubmit: function() {
				let self = this;
				self.$refs.form.validate(valid => {
					if (valid) {
						let params = self.form;
						params.equity_id = self.equity_id;
						self.save_loading = true;
						CardApi.editequity(params, true)
							.then(data => {
								self.save_loading = false;
								ElMessage({
									message: '保存成功',
									type: 'success'
								});
								self.cancelFunc();
							})
							.catch(error => {
								self.save_loading = false;
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
		padding-bottom: 50px;
	}
</style>