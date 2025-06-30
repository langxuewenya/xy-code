<template>

	<div class="user">
		<el-form size="small" ref="form" :model="form" label-width="150px">
			<el-form-item label="拼团列表图片" :rules="[{required: true,message: '请选择图片'}]">
				<div class="ww100">
					<el-button @click="chooseImg('image')">选择图片</el-button>
				</div>
				<img class="mt10" v-img-url="form.image" :width="200">
			</el-form-item>
			<el-form-item label="虚拟用户头像：" :rules="[{ required: true, message: '请上传虚拟用户头像' }]" prop="user_image">
				<div class="draggable-list">
					<draggable class="wrapper f-w" v-model="form.user_image">
						<template #item="{ element, index }">
							<div class="item">
								<img v-img-url="element" />
								<a href="javascript:void(0);" class="delete-btn" @click.stop="deleteImg(index)">
									<el-icon>
										<Close />
									</el-icon>
								</a>
							</div>
						</template>
					</draggable>
					<div class="item img-select" @click="chooseImg('user')">
						<el-icon>
							<Plus></Plus>
						</el-icon>
					</div>
				</div>
				<div class="tips red">尺寸：100*100</div>
			</el-form-item>
			<!--提交-->
			<el-form-item>
				<el-button type="primary" @click="onSubmit" :loading="loading">保存</el-button>
			</el-form-item>
		</el-form>
		<!--上传图片-->
		<Upload v-if="isupload" :isupload="isupload" :type="type" :config="{ total: 1 }" @returnImgs="returnImgsFunc">
		</Upload>
	</div>
</template>
<script>
	import AssembleApi from '@/api/assemble.js';
	import Upload from '@/components/file/Upload.vue';
	import draggable from 'vuedraggable';
	export default {
		components: {
			Upload,
			draggable
		},
		data() {
			return {
				form: {
					image: '',
					user_image: []
				},
				setting: [],
				loading: true,
				/*是否打开图片选择*/
				isupload: false
			};
		},
		created() {
			/*获取列表*/
			this.getSetting();
		},
		methods: {
			/*获取设置*/
			getSetting() {
				let self = this;
				let Params = {};
				AssembleApi.getSetting(Params, true)
					.then(data => {
						self.loading = false;
						self.form = data.data.vars.values;
					})
					.catch(error => {});
			},
			/*点击保存*/
			onSubmit() {
				let self = this;
				let params = self.form;
				self.loading = true;
				AssembleApi.saveSetting(params, true)
					.then(data => {
						self.loading = false;
						if (data.code == 1) {
							ElMessage({
								message: '恭喜你，保存成功',
								type: 'success'
							});
							self.getSetting();
						} else {
							self.loading = false;
						}
					})
					.catch(error => {
						self.loading = false;
					});
			},
			/*选择图片*/
			chooseImg(e) {
				this.type = e;
				this.isupload = true;
			},

			/*关闭选择图片*/
			returnImgsFunc(e) {
				this.isupload = false;
				if (e != null && e.length > 0) {
					if (this.type == 'image') {
						this.form.image = e[0].file_path;
					}else if (this.type == 'user') {
						this.form.user_image = this.form && this.form.user_image || [];
						if (e && e.length > 0) {
							this.form.user_image = this.form.user_image.concat(e[0].file_path);
						}
					}
					
				}
			},
			/*删除课程图片*/
			deleteImg(index) {
				this.form.user_image.splice(index, 1);
			},
		}
	};
</script>

<style>
	.draggable-list {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.draggable-list .wrapper>span {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.draggable-list .item {
		position: relative;
		width: 110px;
		height: 110px;
		margin-top: 10px;
		margin-right: 10px;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid #dddddd;
	}

	.draggable-list .delete-btn {
		position: absolute;
		top: 0;
		right: 0;
		width: 16px;
		height: 16px;
		background: red;
		line-height: 16px;
		font-size: 16px;
		color: #ffffff;
		display: none;
	}

	.draggable-list .item:hover .delete-btn {
		display: block;
	}

	.draggable-list .item img {
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		max-height: 100%;
		max-width: 100%;
	}

	.draggable-list .img-select {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px dashed #dddddd;
		font-size: 30px;
	}

	.draggable-list .img-select i {
		color: #409eff;
	}
</style>