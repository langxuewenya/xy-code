<template>

	<div class="product-add">
		<!--form表单-->
		<el-form size="small" ref="form" :model="form" label-width="150px">
			<!--添加门店-->
			<div class="common-form">订单流程设置</div>
			<el-form-item label="未支付订单">
				<el-input v-model="form.close_days" type="number" style="width: 200px;"></el-input>
				天后自动关闭
				<div class="tips">
					订单下单未付款，n天后自动关闭，设置0天不自动关闭
				</div>
			</el-form-item>
			<div class="common-form">积分商城订单流程设置</div>
			<el-form-item label="已发货订单">
				<el-input v-model="form.points_days" type="number" style="width: 200px;"></el-input>
				天后自动核销
				<div class="tips">
					如果在期间未核销，系统自动完成核销，设置0不自动核销
				</div>
			</el-form-item>

			<!--提交-->
			<div class="common-button-wrapper">
				<el-button type="primary" @click="onSubmit" :loading="loading">提交</el-button>
			</div>
		</el-form>


	</div>

</template>

<script>
	import SettingApi from '@/api/setting.js';

	export default {
		data() {
			return {
				/*切换菜单*/
				// activeIndex: '1',
				/*form表单数据*/
				form: {
					close_days: '',
					points_days: ''
				},
				loading: false,
			};
		},
		created() {
			this.getParams()
		},

		methods: {

			getParams() {
				let self = this;
				SettingApi.tradeDetail({}, true)
					.then(data => {
						if (data.code == 1) {
							let vars = data.data.vars.values;
							self.form.close_days = vars.order.close_days;
							self.form.points_days = vars.order.points_days;
						}
					})
					.catch(error => {

					});
			},
			//监听复选框选中
			handleCheckedCitiesChange(val) {},
			onSubmit() {
				let self = this;
				self.loading = true;
				let form = self.form;
				SettingApi.editTrade(form, true)
					.then(data => {
						self.loading = false;
						ElMessage({
							message: '恭喜你，交易设置成功',
							type: 'success'
						});
						self.$router.push('/setting/trade/index');
					})
					.catch(error => {
						self.loading = false;
					});
			},


		}

	};
</script>

<style>
	.tips {
		color: #ccc;
	}
</style>