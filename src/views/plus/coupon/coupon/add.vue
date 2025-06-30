<template>

	<div class="product-add">
		<!--form表单-->
		<el-form size="small" ref="form" :model="form" label-width="200px">
			<el-tabs v-model="activeName" type="card">
				<el-tab-pane label="基本信息" name="1"></el-tab-pane>
				<el-tab-pane label="适用商品" name="2"></el-tab-pane>
			</el-tabs>
			<template v-if="activeName=='1'">
				<div class="common-form">添加优惠券</div>
				<el-form-item label="优惠券名称" prop="name" :rules="[{ required: true, message: ' ' }]">
					<el-input v-model="form.name" placeholder="请输入优惠券名称"></el-input>
					<div class="tips">例如：满100减10</div>
				</el-form-item>
				<el-form-item label="优惠券类型">
					<el-radio-group v-model="form.coupon_type">
						<el-radio label="10">满减券</el-radio>
						<el-radio label="20">折扣券</el-radio>
					</el-radio-group>
				</el-form-item>
				<div v-if="form.coupon_type == 10">
					<el-form-item label="减免金额" prop="reduce_price" :rules="[{ required: true, message: ' ' }]">
						<el-input v-model="form.reduce_price" placeholder="请输入减免金额" type="number"></el-input>
					</el-form-item>
				</div>
				<div v-else>
					<el-form-item label="折扣率 " prop="discount" :rules="[{ required: true, message: ' ' }]">
						<el-input v-model="form.discount" placeholder="请输入折扣率" type="number"></el-input>
						<div class="tips">折扣率范围0-10，9.5代表9.5折，0代表不折扣</div>
					</el-form-item>
					<el-form-item label="最多优惠金额" prop="max_price" :rules="[{ required: true, message: ' ' }]">
						<el-input v-model="form.max_price" placeholder="请输入最多优惠金额" type="number"></el-input>
						<div class="tips">最大抵扣金额不能超出此金额，0代表不限制</div>
					</el-form-item>
				</div>

				<el-form-item label="最低消费金额" prop="min_price" :rules="[{ required: true, message: ' ' }]">
					<el-input v-model="form.min_price" placeholder="请输入最低消费金额" type="number"></el-input>
				</el-form-item>

				<el-form-item label="到期类型">
					<el-radio-group v-model="form.expire_type">
						<el-radio label="10">领取后生效</el-radio>
						<el-radio label="20">固定时间</el-radio>
					</el-radio-group>
				</el-form-item>
				<div v-if="form.expire_type == 10">
					<el-form-item label="有效天数">
						<el-input v-model="form.expire_day" placeholder="请输入有效天数" type="number"></el-input>
					</el-form-item>
				</div>
				<div v-else>
					<el-form-item label="有效时间">
						<el-date-picker v-model="form.active_time" type="daterange" align="right" unlink-panels
							value-format="YYYY-MM-DD" range-separator="至" start-placeholder="开始日期"
							end-placeholder="结束日期" :picker-options="pickerOptions0"></el-date-picker>
					</el-form-item>
				</div>
				<el-form-item label="发放总数量 " prop="total_num" :rules="[{ required: true, message: ' ' }]">
					<el-input v-model="form.total_num" placeholder="请输入发放总数量" type="number"></el-input>
					<div class="tips">限制领取的优惠券数量，-1为不限制</div>
				</el-form-item>
				<el-form-item label="是否显示在领券中心">
					<el-radio-group v-model="form.show_center">
						<el-radio :label="1">显示</el-radio>
						<el-radio :label="0">不显示</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="使用条件">
					<el-radio-group v-model="form.free_limit">
						<el-radio :label="0">不限制</el-radio>
						<!-- <el-radio :label="1">不可与促销同时使用</el-radio> -->
						<el-radio :label="2">不可与会员优惠同时使用</el-radio>
						<!-- <el-radio :label="3">不可于促销和等级优惠同时使用</el-radio> -->
					</el-radio-group>
					<div class="tips">会员优惠指会员价格</div>
				</el-form-item>
				<el-form-item label="排序">
					<el-input type="number" v-model="form.sort" placeholder="请输入排序"></el-input>
				</el-form-item>

			</template>
			<template v-if="activeName=='2'">
				<div class="common-form">适用商品</div>
				<el-form-item label="选择">
					<el-radio-group v-model="form.apply_range">
						<el-radio :label="10">全部商品</el-radio>
						<el-radio :label="20">
							<span>指定商品</span>
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="form.apply_range==20" prop="product_ids" :rules="[{ required: true, message: ' ' }]">
					<el-select multiple v-model="form.product_ids">
						<el-option v-for="(item,index) in rangeType" :key="item.value+''" :label="item.name+''"
							:value="item.value +''">
						</el-option>
					</el-select>
				</el-form-item>
			</template>
			<!--提交-->
			<div class="common-button-wrapper">
				<el-button type="info" size="small" @click="cancelFunc" :loading="loading">取消</el-button>
				<el-button type="primary" size="small" @click="onSubmit" :loading="loading">提交</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
	import CouponApi from '@/api/coupon.js';
	export default {
		components: {},
		data() {
			return {
				activeName: '1',
				/*form表单数据*/
				form: {
					/*优惠券名称*/
					name: '',
					/*优惠券类型*/
					coupon_type: '10',
					/*减免金额*/
					reduce_price: '',
					/*折扣率*/
					discount: '',
					/*最低消费金额*/
					min_price: '',
					/*到期类型*/
					expire_type: '10',
					/*有效天数*/
					expire_day: '',
					/*有效期*/
					active_time: '',
					/*发放量*/
					total_num: '',
					show_center: 1,
					/*优惠限制0不显示1不可与促销同时2不可与等级优惠同时3不可于促销和等级同*/
					free_limit: 0,
					/*排序*/
					sort: 1,
					apply_range: 10,
					max_price: '',
					product_ids: []
				},
				loading: false,
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
					}
				},
				rangeType: []
			};
		},
		created() {
			this.getData();
		},
		methods: {
			getData(coupon_id) {
				let self = this;
				CouponApi.toaddCoupon()
					.then(data => {
						self.rangeType = data.data.rangeType;
						self.loading = false;
					})
					.catch(error => {
						console.log(error);
						self.loading = false;
					});
			},
			/*添加用户*/
			onSubmit() {
				let self = this;
				let form = self.form;
				self.$refs.form.validate(valid => {
					if (valid) {
						self.loading = true;
						CouponApi.addCoupon(form, true)
							.then(data => {
								self.loading = false;
								ElMessage({
									message: '恭喜你，添加成功',
									type: 'success'
								});
								self.$router.push('/plus/coupon/index');
							})
							.catch(error => {
								self.loading = false;
							});
					}
				});
			},
			/*取消*/
			cancelFunc() {
				this.$router.push({
					path: '/plus/coupon/index',
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
	.mb10 {
		margin-bottom: 10px;
	}

	.product-add {
		padding-bottom: 50px;
	}

	.tips {
		color: #ccc;
	}
</style>