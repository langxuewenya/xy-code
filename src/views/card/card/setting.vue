<template>
	<div class="product-add" v-if="!loading">
		<!--form表单-->
		<el-form size="small" ref="form" :model="form" label-width="200px">
			<div class="common-form">会员设置</div>
			<el-form-item label="权益图标：" prop="equity_image" :rules="[{ required: true, message: '请上传图片' }]">
				<div class="d-s-c f-w maxwidth-530">
					<div class="img" @click="openUpload()">
						<img v-img-url="form.equity_image" width="80" height="80" />
					</div>
					<div class="gray9">会员卡界面更多权益图标，建议上传图片尺寸比例为80:80</div>
				</div>
			</el-form-item>
			<div class="basic-setting-content pl16 pr16">
				<el-form-item label="会员说明：">
					<div class="edit_container">
						<Uediter :text="form.describe" :config="ueditor.config" ref="ue"
							@contentChange="contentChangeFunc" :id="ueditor.id">
						</Uediter>
					</div>
				</el-form-item>
			</div>
			<div class="common-button-wrapper">
				<el-button type="primary" @click="onSubmit" :loading="loading">提交</el-button>
			</div>
		</el-form>
		<!--上传图片组件-->
		<Upload v-if="isupload" :isupload="isupload" :config="config" @returnImgs="returnImgsFunc">上传图片</Upload>
	</div>
</template>
<script>
	import Uediter from '@/components/UE.vue';
	import SettingApi from '@/api/card.js';
	import Upload from '@/components/file/Upload.vue';
	export default {
		components: {
			Uediter,
			Upload,
		},
		data() {
			return {
				/*是否正在加载*/
				loading: true,
				/*form表单数据*/
				form: {
					describe: '',
				},
				/*富文本配置*/
				ueditor: {
					text: '',
					config: {
						initialFrameWidth: 400,
						initialFrameHeight: 500
					},
					id: 'card_describe'
				},
				config: {},
				isupload: false,
			};
		},
		mounted() {
			this.getParams()
		},
		methods: {
			/*获取配置数据*/
			getParams() {
				let self = this;
				SettingApi.toSettingCard({}, true).then(res => {
						let vars = res.data.vars;
						self.form = vars;
						self.loading = false;
					})
					.catch(error => {
						self.loading = false;
					});
			},
			/*获取富文本内容*/
			contentChangeFunc(e) {
				this.form.describe = e;
			},
			/*提交*/
			onSubmit() {
				let self = this;
				let params = {};
				params = self.form;
				self.$refs.form.validate((valid) => {
					if (valid) {
						self.loading = true;
						SettingApi.settingCard(params, true)
							.then(data => {
								self.loading = false;
								ElMessage({
									message: '恭喜你，设置成功',
									type: 'success'
								});
								self.$router.push('/card/card/setting');
							})
							.catch(error => {
								self.loading = false;
							});
					}
				});

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
					this.form.equity_image = e[0].file_path;
				}
				this.isupload = false;
			},
		}

	};
</script>
<style>
</style>