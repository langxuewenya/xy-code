<template>
	<div class="product-add" v-loading="loading">
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="基础设置" name="basic"></el-tab-pane>
			<el-tab-pane label="价格设置" name="other"></el-tab-pane>
			<el-tab-pane label="课程详情" name="content"></el-tab-pane>
		</el-tabs>
		<!--form表单-->
		<el-form size="small" ref="form" :model="form" label-width="180px" v-if="!loading">
			<!--基础信息-->
			<Basic v-show="activeName == 'basic'"></Basic>
			<!--价格设置-->
			<Other v-show="activeName == 'other'"></Other>
			<!--商品详情-->
			<Content v-show="activeName == 'content'"></Content>
			<!--审核-->
			<div class="common-button-wrapper" style="height: 50px">
				<el-button size="small" type="info" @click="cancelFunc">取消</el-button>
				<el-button size="small" v-if="form.model.audit_status==0" type="primary" @click="onSubmit('edit')" :disabled="save_loading">提交
				</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
	import AuditApi from '@/api/audit.js';
	import Basic from './part/Basic.vue';
	import Other from './part/Other.vue';
	import Content from './part/Content.vue';
	import {
		formatModel
	} from '@/utils/base.js';
	export default {

		components: {
			/*基础信息*/
			Basic,
			/*价格设置*/
			Other,
			/*商品详情*/
			Content,
		},
		data() {

			return {
				activeName: 'basic',
				/* 审核状态*/
				/*商品ID*/
				course_id: 0,
				/*判断是编辑*/
				scene: 'edit',
				/*是否正在加载*/
				loading: true,
				/*是否正在提交保存*/
				save_loading: false,
				/*form表单数据*/
				form: {
					model: {},
					/*商品分类*/
					category: [],
					lecturer: [],
					audit_status: '',
					audit_remark: '',
				},
				/*模型数据*/
				model: {
					/*商品名称*/
					title: '',
					/*商品分类*/
					category_id: '',
					lecturer_id: '',
					video_link: '',
					video_image: '',
					label: [],
					banner: [],
					image_id: 0,
					image: {
						file_path: ''
					},
					/*商品详情内容*/
					content: '',
					/*商品排序，默认100*/
					sort: 100,
					course_price: '',
					is_pay: 0,
					is_show: 0,
					is_top: 0,
					is_points_discount: '',
					audit_status: '',
					active_price: '',
					active_type: 0,
					assemble_num: '',
					active_start_time: '',
					active_end_time: '',
					active_time: '',
					is_fake: 0,
					fake_num: ''
				}
			};
		},
		provide: function() {
			return {
				form: this.form
			};
		},
		created() {
			/*获取列表*/
			this.course_id = this.$route.query.course_id;
			this.scene = this.$route.query.scene;
			this.getData();
		},
		methods: {
			/**
			 * 获取基础数据
			 */
			getData: function() {
				let self = this;
				AuditApi.getCourseDetail({
							course_id: self.course_id,
							scene: self.scene
						},
						true
					)
					.then(res => {
						self.loading = false;
						Object.assign(self.form, res.data);
						if (self.form.model.audit_status != 0) {
							self.form.audit_status = self.form.model.audit_status;
							self.form.audit_remark = self.form.model.audit_remark;
						} else {
							self.form.audit_status = 10;
						}
						if (res.data.model.active_start_time_text) {
							self.form.model.active_start_time = res.data.model.active_start_time_text;
						} else {
							self.form.model.active_start_time = '';
						}
						if (res.data.model.active_end_time_text) {
							self.form.model.active_end_time = res.data.model.active_end_time_text;
						} else {
							self.form.model.active_end_time = '';
						}
					})
					.catch(error => {
						self.loading = false;
					});
			},
			/*提交*/
			onSubmit: function(submit_type) {
				let self = this;
				if(self.form.model.is_pay == 1 && self.form.model.active_type == 1){
					if(self.form.model.assemble_num < 2){
						return ElMessage({
							message: '拼团人数至少2人',
							type: 'error'
						});
					}
				}
				self.$refs.form.validate(valid => {
					let params = {};
					params.course_id = self.course_id;
					params.audit_status = self.form.audit_status;
					params.audit_remark = self.form.audit_remark;
					if (valid) {
						self.save_loading = true;
						AuditApi.editCourse(params, true)
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