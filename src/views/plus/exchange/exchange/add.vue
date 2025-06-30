<template>

	<div class="product-add pb50">
		<!--添加文章-->
		<el-form size="small" :model="form" ref="form" label-width="100px">
			<div class="common-form">添加活动</div>
			<el-form-item label="活动名称" prop="title" :rules="[{ required: true, message: ' ' }]">
				<el-input v-model="form.title" placeholder="" class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="关联课程">
				<el-select v-model="form.course_id" filterable placeholder="请选择">
					<el-option v-for="(item, index) in course" :key="index" :label="item.title" :value="item.course_id">
					</el-option>
				</el-select>
				<div class="tips">可直接输入搜索课程</div>
			</el-form-item>
			<el-form-item label="状态">
				<el-radio-group v-model="form.status">
					<el-radio :label="10">生效</el-radio>
					<el-radio :label="20">未生效</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="排序" prop="sort" :rules="[{ required: true, message: ' ' }]">
				<el-input type="number" v-model="form.sort" class="max-w460"></el-input>
				<div class="tips">数字小的排前面</div>
			</el-form-item>
			<el-form-item label="描述" prop="content">
				<el-input type="textarea" rows="5" v-model="form.content" placeholder="" class="max-w460"></el-input>
			</el-form-item>
			<!--提交-->
			<div class="common-button-wrapper">
				<el-button size="small" type="info" @click="cancelFunc">取消</el-button>
				<el-button size="small" type="primary" @click="onSubmit" :loading="loading">提交</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
	import ExchangeApi from '@/api/exchange.js';
	export default {
		components: {},
		data() {
			return {
				/*form表单数据*/
				form: {
					title: '',
					course_id: '',
					total_num: '',
					status: 10,
					content: '',
					sort: 100,
				},
				course: [],
				loading: false,
			};
		},
		created() {
			/*获取列表*/
			this.getBase();
		},
		methods: {
			/*获取基础信息*/
			getBase() {
				let self = this;
				let Params = {};
				ExchangeApi.toAddExchange(Params, true)
					.then(res => {
						self.course = res.data.course;
						if (self.course.length > 0) {
							self.form.course_id = self.course[0].course_id;
						}
					})
					.catch(error => {

					});
			},
			/*添加*/
			onSubmit() {
				let self = this;
				let form = self.form;
				self.$refs.form.validate(valid => {
					if (valid) {
						self.loading = true;
						ExchangeApi.addExchange(form, true)
							.then(data => {
								self.loading = false;
								ElMessage({
									message: data.msg,
									type: 'success'
								});
								self.cancelFunc();
							})
							.catch(error => {
								self.loading = false;
							});
					}
				});
			},
			/*取消添加，返回列表*/
			cancelFunc() {
				this.$router.back(-1);
			}
		}
	};
</script>

<style>
</style>