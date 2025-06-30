<template>
	<div class="product-add" v-loading="loading">
		<!--form表单-->
		<el-form size="small" ref="form" :model="form" label-width="180px" v-if="!loading">
			<el-form-item label="讲师名称：" :rules="[{ required: true, message: '请填写讲师名称' }]" prop="model.name">
				<el-input :disabled='true' v-model="form.model.name" class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="讲师手机：" :rules="[{ required: true, message: '请填写讲师手机' }]" prop="model.phone">
				<el-input :disabled='true' v-model="form.model.phone" class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="简介：">
				<el-input :disabled='true' type="textarea" rows="6" v-model="form.model.describe"
					class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="所属分类" prop="model.category">
				<el-input class="max-w460" :value="form.model.category ? form.model.category.name : ''"
					:disabled="true">
				</el-input>
			</el-form-item>
			<el-form-item label="标签：" :rules="[{ required: true, message: '请填写标签' }]" prop="model.label">
				<el-tag :key="tag" v-for="tag in form.model.label" :disable-transitions="false">{{ tag }}</el-tag>
			</el-form-item>
			<el-form-item label="讲师封面:">
				<el-row>
					<div v-if="form.model.image_id != 0" class="img">
						<el-image :src="form.model.image.file_path" style="width: 100px; height: 100px"
							:preview-src-list="srcList" />
					</div>
				</el-row>
			</el-form-item>
			<el-form-item label="讲师星级:" :rules="[{ required: true, message: '讲师星级' }]" prop="star">
				<div class="block d-s-c" style="height: 32px;">
					<el-rate v-model="form.star" :disabled="form.model.status!=0"></el-rate>
				</div>
			</el-form-item>
			<el-form-item label="审核状态">
				<el-radio-group v-model="form.status" :disabled="form.model.status!=0">
					<el-radio :label="1">通过</el-radio>
					<el-radio :label="2">未通过</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="审核备注" prop="remark" v-if="form.status==2"
				:rules="[{ required: true, message: '审核备注' }]">
				<el-input type="textarea" v-model="form.remark" class="max-w460"
					:disabled="form.model.status!=0"></el-input>
			</el-form-item>
			<!--审核-->
			<div class="common-button-wrapper" style="height: 50px">
				<el-button size="small" type="info" @click="cancelFunc">返回</el-button>
				<el-button v-if="form.model.status==0" size="small" type="primary" @click="onSubmit('edit')"
					:disabled="save_loading">提交
				</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
	import LecturerApi from '@/api/lecturer.js';
	import {
		formatModel
	} from '@/utils/base.js';
	export default {
		components: {},
		data() {
			return {
				/*讲师申请ID*/
				lecturer_apply_id: 0,
				/*判断是编辑*/
				scene: '',
				/*是否正在加载*/
				loading: true,
				/*是否正在提交保存*/
				save_loading: false,
				/*form表单数据*/
				form: {
					model: {},
					/*讲师分类*/
					category: [],
					status: 1,
					remark: '',
					star: ''
				},
				/*模型数据*/
				model: {
					scene: '',
					/*商品名称*/
					name: '',
					phone: '',
					describe: '',
					/*商品分类*/
					category_id: '',
					label: [],
					image: {},
					image_id: '',
				},
				srcList: [],
			};
		},
		provide: function() {
			return {
				form: this.form
			};
		},
		created() {
			/*获取列表*/
			this.lecturer_apply_id = this.$route.query.lecturer_apply_id;
			this.scene = this.$route.query.scene;
			this.getData();
		},
		methods: {
			/**
			 * 获取基础数据
			 */
			getData: function() {
				let self = this;
				LecturerApi.getLecturerApply({
							lecturer_apply_id: self.lecturer_apply_id,
							scene: self.scene
						},
						true
					)
					.then(res => {
						self.loading = false;
						Object.assign(self.form, res.data);
						self.form.model.scene = self.scene;
						if (self.form.model.status != 0) {
							self.form.status = self.form.model.status;
							self.form.star = self.form.model.star;
							self.form.remark = self.form.model.remark;
						}

						if (self.form.model.image_id != 0) {
							self.srcList.push(self.form.model.image.file_path);
						}
					})
					.catch(error => {
						self.loading = false;
					});
			},

			/*提交*/
			onSubmit: function(submit_type) {
				let self = this;
				let params = {};
				params.lecturer_apply_id = self.lecturer_apply_id;
				params.status = self.form.status;
				params.remark = self.form.remark;
				params.star = self.form.star;
				if (params.status == 1 && !params.star) {
					ElMessage({
						message: '请选择讲师星级',
						type: 'error'
					});
					return;
				}
				self.$refs.form.validate(valid => {
					if (valid) {
						self.save_loading = true;
						LecturerApi.editLecturerApply(params, true)
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
			}
		}
	};
</script>

<style lang="scss" scoped>
	.basic-setting-content {}

	.product-add {
		padding-bottom: 50px;
	}

	.mb50 {
		margin-bottom: 50px;
	}
</style>