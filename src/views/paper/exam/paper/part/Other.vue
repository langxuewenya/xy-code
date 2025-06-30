<template>
	<div>
		<!--基本信息-->
		<div class="common-form">价格设置</div>
		<el-form-item label="付费类型:" :rules="[{ required: true, message: '选择付费类型' }]" prop="model.pay_type">
			<el-radio-group v-model="form.model.pay_type">
				<el-radio :label="0">免费</el-radio>
				<el-radio :label="1">付费</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item :rules="rules.money" v-if="form.model.pay_type == 1" label="付费金额：" prop="model.money">
			<el-input type="number" min="0.01" v-model="form.model.money" class="max-w460"></el-input>
		</el-form-item>
		<el-form-item label="会员收费方式：" prop="model.member_pay" v-if="form.model.pay_type == 1">
			<el-radio-group v-model="form.model.member_pay">
				<el-radio :label="0">免费</el-radio>
				<el-radio :label="1">付费</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item :rules="rules.member_price" v-if="form.model.pay_type == 1&&form.model.member_pay == 1" label="会员价格：" prop="model.member_price">
			<el-input type="number" min="0.01" v-model="form.model.member_price" class="max-w460"></el-input>
		</el-form-item>
		<el-form-item label="仅会员可见：" prop="model.is_member">
			<el-radio-group v-model="form.model.is_member">
				<el-radio :label="1">是</el-radio>
				<el-radio :label="0">否</el-radio>
			</el-radio-group>
		</el-form-item>
	</div>
</template>

<script>
	export default {
		components: {},
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入金额'));
				} else {
					if (value <= 0) {
						callback(new Error('价格不小于0.01'));
					}
					callback();
				}
			};
			return {
				rules: {
					money: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					member_price: [{
						validator: validatePass,
						trigger: 'blur'
					}],
				}
			};
		},
		inject: ['form'],
		created() {},
		methods: {}
	};
</script>

<style lang="scss" scoped>
	.el-tag--small {
		height: var(--el-component-size-small);
	}

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

	.el-tag+.el-tag {
		margin-left: 10px;
	}

	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}

	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
</style>