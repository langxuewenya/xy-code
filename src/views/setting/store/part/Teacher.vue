<template>
	<div class="basic-setting-content pl16 pr16">
		<!--基本信息-->
		<div class="common-form">讲师端设置</div>
		<el-form-item label="入驻开启短信验证">
			<div>
				<el-radio v-model="form.lectuer_sms_open" label="1">开启</el-radio>
				<el-radio v-model="form.lectuer_sms_open" label="0">关闭</el-radio>
			</div>
		</el-form-item>
		<el-form-item label="课程新增是否审核">
			<div>
				<el-radio v-model="form.add_course_audit" label="1">是</el-radio>
				<el-radio v-model="form.add_course_audit" label="0">否</el-radio>
			</div>
		</el-form-item>
		<el-form-item label="课程修改是否审核">
			<div>
				<el-radio v-model="form.edit_course_audit" label="1">是</el-radio>
				<el-radio v-model="form.edit_course_audit" label="0">否</el-radio>
			</div>
		</el-form-item>
		<el-form-item label="教务新增是否审核">
			<div>
				<el-radio v-model="form.add_edu_audit" label="1">是</el-radio>
				<el-radio v-model="form.add_edu_audit" label="0">否</el-radio>
			</div>
		</el-form-item>
		<el-form-item label="教务修改是否审核">
			<div>
				<el-radio v-model="form.edit_edu_audit" label="1">是</el-radio>
				<el-radio v-model="form.edit_edu_audit" label="0">否</el-radio>
			</div>
		</el-form-item>
		<el-form-item label="考试新增是否审核">
			<div>
				<el-radio v-model="form.add_exam_audit" label="1">是</el-radio>
				<el-radio v-model="form.add_exam_audit" label="0">否</el-radio>
			</div>
		</el-form-item>
		<el-form-item label="考试修改是否审核">
			<div>
				<el-radio v-model="form.edit_exam_audit" label="1">是</el-radio>
				<el-radio v-model="form.edit_exam_audit" label="0">否</el-radio>
			</div>
		</el-form-item>
		<el-form-item label="练习新增是否审核">
			<div>
				<el-radio v-model="form.add_train_audit" label="1">是</el-radio>
				<el-radio v-model="form.add_train_audit" label="0">否</el-radio>
			</div>
		</el-form-item>
		<el-form-item label="练习修改是否审核">
			<div>
				<el-radio v-model="form.edit_train_audit" label="1">是</el-radio>
				<el-radio v-model="form.edit_train_audit" label="0">否</el-radio>
			</div>
		</el-form-item>
		<el-form-item label="入驻背景" :rules="[{ required: true, message: '请输入入驻图片' }]">
			<div class="ww100">
				<el-button @click="chooseImg('lecturer')">选择图片</el-button>
			</div>
			<img class="mt10" v-img-url="form.lecturer_image" :width="200" />
		</el-form-item>
		<!--上传图片-->
		<Upload v-if="isupload" :isupload="isupload" :type="type" :config="{ total: 1 }" @returnImgs="returnImgsFunc">
		</Upload>
	</div>
</template>

<script>
	import Upload from '@/components/file/Upload.vue';
	export default {
		components: {
			Upload
		},
		data() {
			return {
				/*是否打开图片选择*/
				isupload: false,
				type: '',
			};
		},
		inject: ['form'],
		created() {

		},
		methods: {
			/*选择图片*/
			chooseImg(e) {
				this.type = e;
				this.isupload = true;
			},
			/*关闭选择图片*/
			returnImgsFunc(e) {
				this.isupload = false;
				if (e != null && e.length > 0) {
					if (this.type == 'lecturer') {
						this.form.lecturer_image = e[0].file_path;
					}L
				}
			}
		}
	};
</script>
<style lang="scss" scoped>
	.addCustom_content {
		margin-top: 20px;

		.custom_box {
			margin-bottom: 10px;
		}
	}

	.addCustomBox {
		margin-top: 12px;
		font-size: 13px;
		font-weight: 400;
		color: var(--prev-color-primary);

		.btn {
			cursor: pointer;
			width: max-content;
			background-color: rgba(64, 149, 229, 1);
			color: rgba(255, 255, 255, 1);
		}
	}

	.titTip {
		display: inline-bolck;
		font-size: 12px;
		line-height: 24px;
		font-weight: 400;
		color: #999999;
	}

	.addfont {
		display: inline-block;
		font-size: 12px;
		font-weight: 400;
		color: #4095e5;
		margin-left: 14px;
		cursor: pointer;
	}
</style>