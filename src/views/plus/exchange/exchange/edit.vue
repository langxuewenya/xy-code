<template>

	<div class="product-add pb50" v-loading="loading">
		<!--编辑文章-->
		<el-form size="small" :model="form" ref="form" label-width="100px">
			<div class="common-form">编辑活动</div>
			<el-form-item label="活动名称" prop="title" :rules="[{ required: true, message: ' ' }]">
				<el-input v-model="form.title" placeholder="" class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="关联课程">
				<el-select v-model="form.course_id" filterable placeholder="请选择" :disabled="true">
					<el-option v-for="(item, index) in course" :key="index" :label="item.title" :value="item.course_id">
					</el-option>
				</el-select>
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
				<el-button size="small" type="info" @click="cancelFunc" :loading="loading">取消</el-button>
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
				/*是否加载完成*/
				loading: true,
				/*form表单数据*/
				form: {
					exchange_id: 0,
					title: '',
					course_id: '',
					total_num: '',
					status: 10,
					content: '',
					sort: 100,
				},
				course: []
			};
		},
		created() {
			this.getDetail();
		},

		methods: {
			getDetail() {
				let self = this;
				// 取到路由带过来的参数
				const params = self.$route.query.exchange_id;
				ExchangeApi.toEditExchange({
						exchange_id: params
					}, true).then(res => {
						self.form = res.data.model;
						self.course = res.data.course;
						self.loading = false;
					})
					.catch(error => {});
			},

			/*修改*/
			onSubmit() {
				let self = this;
				let params = self.form;
				params.exchange_id = self.$route.query.exchange_id;
				// 取到路由带过来的参数
				ExchangeApi.editExchange(params, true)
					.then(data => {
						ElMessage({
							message: data.msg,
							type: 'success'
						});
						self.cancelFunc();
					})
					.catch(error => {});
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