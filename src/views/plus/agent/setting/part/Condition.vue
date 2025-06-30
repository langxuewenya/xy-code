<template>

	<div class="product-add mt30">
		<!--form表单-->
		<el-form size="small" ref="form" :model="form" label-width="200px">
			<el-form-item label="分销商申请方式">
				<div>
					<el-radio v-model="form.apply" label="10">人人分销</el-radio>
					<el-radio v-model="form.apply" label="20">申请分销</el-radio>
					<el-radio v-model="form.apply" label="30">后台添加</el-radio>
				</div>
				<div class="tips">
					<p>人人分销：分销商不需要申请,注册会员自动成为分销商</p>
					<p>申请分销：会员需要申请才能成为分销商</p>
					<p>后台添加：分销商只有在后台进行添加，前台会员无法进行申请</p>
				</div>
			</el-form-item>
			<el-form-item label="申请成为分销商条件" v-if="form.apply==20">
				<div>
					<el-radio v-model="form.become" label="10">需后台审核</el-radio>
					<el-radio v-model="form.become" label="20">无需审核</el-radio>
				</div>
			</el-form-item>

			<el-form-item label="购买指定推广成为分销商" v-if="form.apply!=30">

				<el-radio v-model="form.become__buy_product" label="0">关闭</el-radio>
				<el-radio v-model="form.become__buy_product" label="1">开启</el-radio>
				<div class="tips">购买指定推广课程和教务付款后自动成为分销商，无需后台审核</div>
				<template v-if="form.become__buy_product == 1">
					<div class="ww100">
						<el-button type="primary" @click="openProduct" class="mb16">选择课程</el-button>
					</div>
					<el-row v-if="form.product_image && form.product_image.length > 0" class="ww100">
						<div v-for="(item, index) in form.product_image" :key="index" class="imgItem pr mr10">
							<img v-bind:src="item.image" width="100" height="100" />
							<a href="javascript:void(0)" class="delete-btn" @click="deleteFunc(index)">
								<el-icon>
									<CircleCloseFilled />
								</el-icon>
							</a>
							<p class="text-ellipsis">{{ item.title }}</p>
						</div>
					</el-row>
				</template>

			</el-form-item>

			<el-form-item label="成为下线条件">
				<div><el-radio v-model="form.downline" label="10">首次点击分享链接</el-radio></div>
			</el-form-item>

			<!--提交-->
			<div class="common-button-wrapper"><el-button size="small" type="primary" @click="onSubmit"
					:loading="loading">提交</el-button></div>
		</el-form>
		<!--产品列表弹出层组件-->
		<Product :iscourse="iscourse" :islist="islist" @closeDialog="closeDialogFunc($event)">列表弹出层</Product>
	</div>
</template>

<script>
	import PlusApi from '@/api/plus.js';
	import Product from '@/components/course/Course.vue';
	export default {
		components: {
			/*产品列表组件*/
			Product: Product
		},
		data() {
			return {
				/*切换菜单*/
				// activeIndex: '1',
				/*form表单数据*/
				form: {},
				/*是否打开产品弹出层*/
				iscourse: false,
				loading: false,
				islist: false
			};
		},
		props: {
			settingData: Object
		},
		created() {
			this.form = this.settingData.data.condition.values;
			if (!this.form.product_image) {
				this.form.product_image = [];
			}
		},

		methods: {
			/*提交表单*/
			onSubmit() {
				let self = this;
				self.loading = true;
				let params = this.form;
				PlusApi.condition(params, true)
					.then(data => {
						self.loading = false;
						ElMessage({
							message: '恭喜你，设置成功',
							type: 'success'
						});
					})
					.catch(error => {
						self.loading = false;
					});
			},

			/*删除商品*/
			deleteFunc(i) {
				this.form.become__buy_product_ids.splice(i, 1);
				this.form.product_image.splice(i, 1);
			},

			/*产品列表弹出层*/
			openProduct() {
				this.iscourse = true;
			},

			/*关闭弹窗*/
			closeDialogFunc(e) {
				this.iscourse = e.openDialog;
				if (e.type == 'success') {
					if (this.form.become__buy_product_ids.indexOf(e.params[0].course_id) == -1) {
						this.form.become__buy_product_ids.push(e.params[0].course_id);
						this.form.product_image.push({
							course_id: e.params[0].course_id,
							image: e.params[0].image ? e.params[0].image.file_path : '',
							title: e.params[0].title
						});
					} else {
						ElMessage({
							message: '已选择该课程',
							type: 'warning'
						});
					}
				}
			}
		}
	};
</script>

<style scoped="scoped">
	.tips {
		color: #ccc;
	}

	.img {
		width: 100px;
		margin-top: 10px;
		height: 130px;
		margin-right: 10px;
	}

	.img img {
		border: 1px solid #eeeeee;
	}

	.delete-btn {
		position: absolute;
		display: block;
		width: 20px;
		height: 20px;
		line-height: 20px;
		right: -8px;
		top: -8px;
		color: red;
	}
</style>