<template>

	<div class="user">
		<div class="common-form">发送优惠券</div>
		<div class="product-content">
			<el-form ref="form" size="small" :model="form" label-width="150px">
				<el-form-item label="发送对象">
					<el-radio v-model="form.send_type" label="1">全站会员</el-radio>
					<el-radio v-model="form.send_type" label="2">指定会员</el-radio>
				</el-form-item>
				<el-form-item label="选择会员" v-if="form.send_type == 2">
					<div class="d-s-s d-c">
						<el-button @click="openGetuser" icon="Plus">选择会员</el-button>
						<ul class="d-s-s select-user">
							<li class="mr10 d-c-c d-c p-10-0" v-for="(item, index) in select_list" :key="index">
								<div class="pr" @click="deleteUser(index)">
									<el-icon class="Minus-icon">
										<Minus />
									</el-icon>
									<img :src="item.avatarUrl" class="radius" width="30" height="30" />

								</div>
								<p class="lh18 ww100 text-ellipsis tc">{{ item.nickName }}</p>
							</li>
						</ul>
					</div>
				</el-form-item>
				<el-form-item label="选择优惠券 " prop="name" :rules="[{ required: true, message: ' ' }]">
					<el-input type="text" v-model="form.name" placeholder="请选择优惠券" class="max-w460"
						:disabled="true"></el-input>
					<el-button @click="openConpon" icon="Plus" style="margin-left: 6px;">选择优惠券</el-button>
					<p class="ww100">注： 发送的优惠券会员领取已达到限制数量，将不再发送给该会员。</p>
				</el-form-item>
				<!--提交-->
				<div class="common-button-wrapper">
					<el-button size="small" type="primary" @click="onSubmit" :loading="loading">提交</el-button>
				</div>
			</el-form>
		</div>

		<!--选择用户-->
		<GetUser :excludeIds="select_list" :is_open="open_getuser" @close="closeGetuserFunc"></GetUser>

		<!--选择优惠券-->
		<GetCoupon v-if="open_coupon" :open_add="open_coupon" @closeDialog="closeCouponFunc($event, 'add')"></GetCoupon>
	</div>
</template>

<script>
	import CouponApi from '@/api/coupon.js';
	import GetUser from '@/components/user/GetUser.vue';
	import GetCoupon from '@/components/coupon/GetCoupon.vue';
	export default {
		components: {
			GetUser,
			GetCoupon
		},
		data() {
			return {
				/*是否加载完成*/
				loading: false,
				/*表单数据对象*/
				form: {
					send_type: '1',
					coupon_id: 0,
					user_ids: '',
					name: ''
				},
				/*获取用户是否显示*/
				open_getuser: false,
				/*选择的用户列表*/
				select_list: [],
				/*是否显示获取优惠券*/
				open_coupon: false
			};
		},
		created() {},
		methods: {
			deleteUser(n) {
				this.select_list.splice(n, 1);
			},

			/*打开获取用户*/
			openGetuser() {
				this.open_getuser = true;
			},

			/*关闭获取用户*/
			closeGetuserFunc(e) {
				if (e && e.type != 'error') {
					this.select_list = this.select_list.concat(e.params);
				}
				this.open_getuser = false;
			},

			/*选择优惠券*/
			openConpon() {
				this.open_coupon = true;
			},

			/*关闭优惠券*/
			closeCouponFunc(e) {
				this.open_coupon = false;
				if (e.type != 'error') {
					this.form.name = e.params.name;
					this.form.coupon_id = e.params.coupon_id;
				}
			},

			/*提交*/
			onSubmit() {
				let self = this;
				let params = self.form;
				/*如果是指定用户*/
				if (params.send_type == 2) {
					let user_ids = [];
					self.select_list.forEach((item) => {
						user_ids.push(item.user_id);
					});
					params.user_ids = user_ids.join(',');
				}
				CouponApi.SendCoupon(params, true)
					.then(data => {
						self.loading = false;
						ElMessage({
							message: '发送成功',
							type: 'success'
						});
					})
					.catch(error => {
						self.loading = false;
					});
			}
		}
	};
</script>

<style scoped="scoped">
	.select-user li {
		width: 30px;
	}

	.pr:hover>.Minus-icon {
		display: inline-flex;
	}

	.Minus-icon {
		display: none;
		position: absolute;
		z-index: 2;
		font-size: 20px;
		background-color: #d12e32;
		color: #fff;
		padding: 5px;
		border-radius: 50%;
		font-weight: bold;
		right: -11px;
		top: -5px;
	}
</style>