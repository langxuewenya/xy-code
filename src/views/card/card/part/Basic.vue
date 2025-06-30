<template>
	<div class="basic-setting-content pl16 pr16">
		<!--基本信息-->
		<div class="common-form">基本信息</div>
		<el-form-item label="会员卡名称：" :rules="[{ required: true, message: '请填写会员卡名称' }]" prop="model.card_name">
			<el-input v-model="form.model.card_name" class="max-w460"></el-input>
		</el-form-item>
		<!-- <el-form-item label="会员卡图片：" prop="model.card_image" :rules="[{ required: true, message: '请上传会员卡图片' }]">
			<div class="d-s-c f-w maxwidth-530">
				<div class="img" @click="openUpload()">
					<img v-img-url="form.model.card_image" width="111" height="61" />
				</div>
				<div class="gray9">建议上传图片尺寸比例为111:61</div>
			</div>
		</el-form-item> -->
		<el-form-item label="排序：" :rules="[{ required: true, message: '请填写排序' }]" prop="model.sort">
			<el-input v-model="form.model.sort" class="max-w460"></el-input>
		</el-form-item>
		<el-form-item label="开卡赠送：">
			<el-checkbox v-model="form.model.is_points" :true-label="1" :false-label='0'> 积分</el-checkbox>
			<el-checkbox v-model="form.model.is_coupon" :true-label="1" :false-label='0'> 优惠券</el-checkbox>
			<el-checkbox v-model="form.model.is_balance" :true-label="1" :false-label='0'> 余额</el-checkbox>
		</el-form-item>
		<el-form-item label="积分：" :rules="[{ required: true, message: '请填写积分数量' }]" prop="model.points"
			v-if="form.model.is_points">
			<el-input v-model="form.model.points" class="max-w460"></el-input>
		</el-form-item>
		<el-form-item label="余额：" :rules="[{ required: true, message: '请填写余额数量' }]" prop="model.balance"
			v-if="form.model.is_balance">
			<el-input v-model="form.model.balance" class="max-w460"></el-input>
		</el-form-item>
		<el-form-item label="优惠券：" :rules="[{ required: true, message: '请填写优惠券' }]" prop="model.coupon"
			v-if="form.model.is_coupon">
			<div class="d-s-c">
				<div style="width: 460px;border: 1px solid #dedede;min-height: 32px;"><span
						v-for="(item,index) in form.model.coupon" :key="index">{{item.name+';'}}</span></div>
				<span></span>
				<el-button type="primary" @click="addCoupon()">添加优惠券</el-button>
			</div>
		</el-form-item>
		<el-form-item label="" v-if="form.model.is_coupon">
			<el-table :data="form.model.coupon" style="width: 60%">
				<el-table-column prop="name" label="券名称">
				</el-table-column>
				<el-table-column prop="coupon_num" label="数量" :rules="[{required: true,message: ' '}]">
					<template #default="scope">
						<el-input type="coupon_num" v-model="scope.row.coupon_num" placeholder="">
						</el-input>
					</template>
				</el-table-column>
				<el-table-column label="操作" prop="address">
					<template #default="scope">
						<el-button type="primary" size="small" link @click='delcoupon(scope.row)'> 删除 </el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-form-item>
		<!--上传图片组件-->
		<Upload v-if="isupload" :isupload="isupload" :type="type" @returnImgs="returnImgsFunc">上传图片</Upload>
		<!--选择优惠券-->
		<GetCoupon v-if="open_add" :open_add="open_add" :config="config" @closeDialog="closeProductDialogFunc($event)">选择优惠券弹出层
		</GetCoupon>
	</div>
</template>

<script>
	import Upload from '@/components/file/Upload.vue';
	import draggable from 'vuedraggable';
	import GetCoupon from '@/components/coupon/GetCoupon.vue';
	export default {
		components: {
			Upload,
			draggable,
			GetCoupon
		},
		data() {
			return {
				config: {},
				isupload: false,
				open_add: false
			};
		},
		inject: ['form'],
		created() {

		},
		methods: {
			chooseCardType(e) {
				this.form.model.card_image = e;
			},
			/*添加优惠券*/
			addCoupon() {
				if (this.form.model.coupon.length >= 15) {
					ElMessage.error('您已经选择了十五张优惠券，若要更换请删除其他优惠券！');
					return
				}

				this.open_add = true;
			},
			/*关闭优惠券*/
			closeProductDialogFunc(e) {
				let self = this;
				self.open_add = e.openDialog;
				console.log(e)
				if (e.type == 'success') {
					let params = {
						coupon_id: e.params.coupon_id,
						name: e.params.name,
						coupon_num: 1,
						discount: e.params.discount,
						reduce_price: e.params.reduce_price,
						coupon_type: e.params.coupon_type,
						min_price: e.params.min_price,
					}
					self.form.model.coupon.push(params);
				}
			},
			delcoupon(item) {
				let self = this;
				console.log(item)
				let n = self.form.model.coupon.indexOf(item);
				self.form.model.coupon.splice(n, 1);
			},
			/*上传*/
			openUpload(e) {
				this.config = {
				  total: 1,
				  file_type: 'image'
				};
				this.isupload = true;
			},
			/*获取图片*/
			returnImgsFunc(e) {
				if (e != null && e.length > 0) {
					this.form.model.card_image = e[0].file_path;
				}
				this.isupload = false;
			},
		}
	};
</script>

<style lang="scss">
	.edit_container {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		line-height: 20px;
		color: #2c3e50;
	}

	.ql-editor {
		height: 400px;
	}

	.draggable-list {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.draggable-list .wrapper>span {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.draggable-list .item {
		position: relative;
		width: 110px;
		height: 110px;
		margin-top: 10px;
		margin-right: 10px;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid #dddddd;
	}

	.draggable-list .delete-btn {
		position: absolute;
		top: 0;
		right: 0;
		width: 16px;
		height: 16px;
		background: red;
		line-height: 16px;
		font-size: 16px;
		color: #ffffff;
		display: none;
	}

	.draggable-list .item:hover .delete-btn {
		display: block;
	}

	.draggable-list .item img {
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		max-height: 100%;
		max-width: 100%;
	}

	.draggable-list .img-select {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px dashed #dddddd;
		font-size: 30px;
	}

	.draggable-list .img-select i {
		color: #409eff;
	}

	.card-el-row {
		margin-bottom: 20px;
		margin-right: 20px;
	}

	.maxwidth-530 {
		max-width: 530px;
	}

	.card {
		border-radius: 4px;
	}

	.active.card {
		border: 2px solid #4aa3f7;
	}
</style>
<style lang="scss"></style>