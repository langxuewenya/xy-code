<template>
	<div>
		<!--基本信息-->
		<div class="common-form">价格设置</div>
		<el-form-item label="收费方式：" prop="model.is_pay">
			<el-radio-group v-model="form.model.is_pay">
				<el-radio :label="0">免费</el-radio>
				<el-radio :label="1">付费</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item :rules="rules.course_price" v-if="form.model.is_pay == 1" label="价格：" prop="model.course_price">
			<el-input type="number" min="0.01" v-model="form.model.course_price" class="max-w460"></el-input>
		</el-form-item>
		<el-form-item v-if="form.model.is_pay==1" label="拼团状态：" prop="model.active_type">
			<el-radio-group v-model="form.model.active_type">
				<el-radio :label="1">开启</el-radio>
				<el-radio :label="0">关闭</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item :rules="rules.active_price" v-if="form.model.active_type == 1&&form.model.is_pay==1"
			label="拼团金额：" prop="model.active_price">
			<el-input type="number" min="0.01" v-model="form.model.active_price" class="max-w460"></el-input>
		</el-form-item>
		<el-form-item :rules="[{ required: true, message: ' ' }]"
			v-if="form.model.active_type == 1&&form.model.is_pay==1" label="拼团人数：" prop="model.assemble_num">
			<el-input type="number" v-model="form.model.assemble_num" class="max-w460"></el-input>
		</el-form-item>
		<el-form-item v-if="form.model.active_type==1&&form.model.is_pay==1" label="开始时间"
			prop="model.active_start_time" :rules="[{ required: true, message: ' ' }]">
			<div class="block">
				<el-date-picker v-model="form.model.active_start_time" value-format="YYYY-MM-DD HH:mm:ss"
					type="datetime" placeholder="选择日期时间"></el-date-picker>
			</div>
		</el-form-item>
		<el-form-item v-if="form.model.active_type==1&&form.model.is_pay==1" label="结束时间" prop="model.active_end_time"
			:rules="[{ required: true, message: ' ' }]">
			<div class="block">
				<el-date-picker v-model="form.model.active_end_time" value-format="YYYY-MM-DD HH:mm:ss"
					type="datetime" placeholder="选择日期时间"></el-date-picker>
			</div>
		</el-form-item>
		<el-form-item :rules="[{ required: true, message: ' ' }]"
			v-if="form.model.active_type == 1&&form.model.is_pay==1" label="拼团时间：" prop="model.active_time">
			<el-input type="number" v-model="form.model.active_time" class="max-w460"></el-input>
			<span class="pl16">小时</span>
		</el-form-item>
		<el-form-item v-if="form.model.active_type==1&&form.model.is_pay==1" label="模拟成团：" prop="is_fake">
			<el-radio-group v-model="form.model.is_fake">
				<el-radio :label="1">开启</el-radio>
				<el-radio :label="0">关闭</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item :rules="[{ required: true, message: ' ' }]"
			v-if="form.model.active_type == 1&&form.model.is_pay==1&&form.model.is_fake==1" label="补齐比例：" prop="model.fake_num">
			<el-input type="number" v-model="form.model.fake_num" class="max-w460"></el-input>
			<div class="tips">注：请输入0-100数字，拼团结束前实际拼团人数达不到拼团要求时，可根据补齐比例自动添加人数，达到拼团成功的目的</div>
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
					course_price: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					active_price: [{
						validator: validatePass,
						trigger: 'blur'
					}]
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