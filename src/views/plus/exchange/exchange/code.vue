<template>

	<div class="product-add pb50" v-loading="loading">
		<!--编辑文章-->
		<el-form size="small" :model="form" ref="form" label-width="100px">
			<div class="common-form">生成码</div>
			<el-form-item label="活动名称" prop="title">
				{{model.title}}
			</el-form-item>
			<el-form-item label="码前缀">
				<el-input v-model="form.prefix" placeholder="" class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="密码位数" :rules="[{ required: true, message: ' ' }]" prop="code_len">
				<el-input v-model="form.code_len" placeholder="" class="max-w460"  maxlength="1"></el-input>
				<div class="tips">密码为小于10的数</div>
			</el-form-item>
			<el-form-item label="生成数量" :rules="[{ required: true, message: ' ' }]" prop="code_count">
				<el-input v-model="form.code_count" placeholder="" class="max-w460"></el-input>
<!-- 				<div class="tips">一次最多生成数量1000</div> -->
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
					card_id: 0,
					prefix: '',
					start_num: '',
					code_len: 6,
					code_count: '',
					start_time: '',
					end_time: '',
				},
				model: {},
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
				ExchangeApi.toCodeExchange({
						exchange_id: params
					}, true).then(res => {
						self.model = res.data.model;
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
				ExchangeApi.codeExchange(params, true)
					.then(data => {
						ElMessage({
							message: data.msg,
							type: 'success'
						});
						self.cancelFunc();
					})
					.catch(error => {});
			},

			/*取消添加，返回文章列表*/
			cancelFunc() {
				this.$router.back(-1);
			}
		}
	};
</script>

<style>
</style>