<template>
	<div class="product-add">
		<el-tabs v-model="activeName">
			<el-tab-pane label="基本信息" name="basic"></el-tab-pane>
			<el-tab-pane label="领取设置" name="set"></el-tab-pane>
		</el-tabs>
		<!--form表单-->
		<el-form size="small" ref="form" :model="form" label-width="180px">
			<!--基础信息-->
			<Basic v-show="activeName == 'basic'"></Basic>
			<!--高级设置-->
			<Set v-show="activeName == 'set'"></Set>
			<!--提交-->
			<div class="common-button-wrapper">
				<el-button size="small" type="info" @click="cancelFunc">取消</el-button>
				<el-button size="small" type="primary" @click="onSubmit" :loading="loading">提交</el-button>
			</div>
		</el-form>
	</div>
</template>
<script>
	import CardApi from '@/api/card.js';
	import Basic from './part/Basic.vue';
	import Set from './part/set.vue';
	export default {
		components: {
			/*基础信息*/
			Basic,
			/*高级设置*/
			Set
		},
		data() {
			return {
				activeName: 'basic',
				/*是否正在加载*/
				loading: false,
				/*form表单数据*/
				form: {
					model: {
						card_name: '',
						card_image: '',
						is_points: 0,
						points: 0,
						is_coupon: 0,
						coupon: [],
						is_balance: 0,
						balance: 0,
						expire: '',
						line_money: '',
						money: '',
						status: 1,
						sort: '',
					},
				}
			};
		},
		provide: function() {
			return {
				form: this.form,
			}
		},
		created() {},
		methods: {

			/*提交*/
			onSubmit: function() {
				let self = this;
				let params = self.form.model;
				self.$refs.form.validate(valid => {
					if (valid) {
						self.loading = true;
						CardApi.addcard({
								params: JSON.stringify(params)
							}, true)
							.then(data => {
								self.loading = false;
								ElMessage({
									message: '添加成功',
									type: 'success'
								});
								self.$router.push('/card/card/index');
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