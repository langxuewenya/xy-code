<template>
	<div class="product-add">
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="基础设置" name="basic"></el-tab-pane>
			<el-tab-pane label="价格设置" name="other"></el-tab-pane>
			<el-tab-pane label="课程详情" name="content"></el-tab-pane>
		</el-tabs>
		<!--form表单-->
		<el-form size="small" ref="form" :model="form" label-width="180px">
			<!--基础信息-->
			<Basic v-show="activeName == 'basic'"></Basic>
			<!--价格设置-->
			<Other v-show="activeName == 'other'"></Other>
			<!--商品详情-->
			<Content v-show="activeName == 'content'"></Content>
			<!--提交-->
			<div class="common-button-wrapper">
				<el-button size="small" type="info" @click="cancelFunc">取消</el-button>
				<el-button size="small" type="primary" @click="onSubmit" :loading="loading">保存</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
	import CourseApi from '@/api/course.js';
	import Basic from './part/Basic.vue';
	import Other from './part/Other.vue';
	import Content from './part/Content.vue';
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
				/*是否正在加载*/
				loading: false,
				/*form表单数据*/
				form: {
					model: {
						scene: 'add',
						/*课程名称*/
						title: '',
						/*课程分类*/
						category_id: '',
						lecturer_id: '',
						video_link: '',
						video_image: '',
						label: [],
						banner: [],
						image_id: '',
						image: {
							file_path: ''
						},
						/*详情内容*/
						content: '',
						/*排序，默认100*/
						sort: 100,
						course_price: '',
						is_pay: 0,
						is_show: 0,
						is_top: 0,
						is_points_discount: 1,
						active_price: '',
						active_type: 0,
						assemble_num: '',
						active_start_time: '',
						active_end_time: '',
						active_time: '',
						is_fake: 0,
						fake_num: '',
						is_member: 0,
						member_pay: 1,
						member_price: ''

					},
					lecturer: [],
					/*分类*/
					category: [],
				}
			};
		},
		provide: function() {
			return {
				form: this.form
			}
		},
		created() {
			/*获取基础数据*/
			this.getBaseData();
		},
		methods: {
			/*获取基础数据*/
			getBaseData: function() {
				let self = this;
				CourseApi.getCourseBaseData({}, true)
					.then(res => {
						self.loading = false;
						Object.assign(self.form, res.data);
					})
					.catch(error => {
						self.loading = false;
					});
			},

			/*提交*/
			onSubmit: function() {
				let self = this;
				if (self.form.model.is_pay == 1 && self.form.model.active_type == 1) {
					if (self.form.model.assemble_num < 2) {
						return ElMessage({
							message: '拼团人数至少2人',
							type: 'error'
						});
					}
				}
				let params = self.form.model;
				self.$refs.form.validate(valid => {
					if (valid) {
						self.loading = true;
						CourseApi.addCourse(params, true)
							.then(data => {
								self.loading = false;
								ElMessage({
									message: '添加成功',
									type: 'success'
								});
								self.$router.push('/course/course/index');
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

		}
	};
</script>

<style lang="scss" scoped>
	.basic-setting-content {}

	.product-add {
		padding-bottom: 100px;
	}
</style>