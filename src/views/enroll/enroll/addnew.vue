<template>
	<div class="product-add">
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="基本信息" name="basic"></el-tab-pane>
		</el-tabs>
		<!--form表单-->
		<el-form size="small" ref="form" :model="form" :rules="rules" label-width="180px">
			<div class="edit-dialog">
				<div class="edit-form">
					<!-- 编辑部分 -->
					<el-form size="small" :model="form" :rules="formRules" ref="form">
						<el-form-item label="名称" prop="title" :label-width="formLabelWidth">
							<el-input v-model="form.title" autocomplete="off" placeholder="请输入名称"></el-input>
						</el-form-item>
						<el-form-item label="开始时间" prop="stime" :label-width="formLabelWidth">
							<el-date-picker
								v-model="form.stime"
								type="datetime"
								placeholder="请选择日期"
								style="width: 100%;"
							/>
						</el-form-item>
						<el-form-item label="截止时间" prop="etime" :label-width="formLabelWidth">
							<el-date-picker
								v-model="form.etime"
								type="datetime"
								placeholder="请选择日期"
								style="width: 100%;"
							/>
						</el-form-item>
						<!-- 添加字段部分 -->
						<div class="edit-title"><b>添加表单字段</b></div>
							<el-form size="small" :model="form" :rules="formRules" ref="form">
								<el-form-item label="字段类型" prop="newField.type" :label-width="formLabelWidth">
									<el-select v-model="form.newField.type" placeholder="请选择">
									<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
									</el-select>
								</el-form-item>
								<el-form-item label="字段标签" prop="newField.label" :label-width="formLabelWidth">
									<el-input v-model="form.newField.label" autocomplete="off" placeholder="请输入字段标签"></el-input>
								</el-form-item>
								<div v-if="form.newField.type === 'radio' || form.newField.type === 'checkbox'" >
									<el-form-item label="选项设置" prop="options" :label-width="formLabelWidth">
									<div v-for="(option, index) in form.newField.options" :key="index">
										<div class="option-item">
											<el-input
												v-model="option.detail"
												type="text"
												placeholder="选项文本"
												class="option-input"
											/>
											<div v-if="form.newField.type === 'radio'"><el-checkbox v-model="option.hasLinkedField" style="margin-right: 5px;">联动</el-checkbox></div>
											<el-button @click="removeOption(index)" type="danger">删除</el-button>
										</div>
										<div v-if="option.hasLinkedField" style="display: block; margin-top: 10px;">
											<el-form-item label="联动字段类型" :label-width="'100px'" class="link-field">
												<el-select v-model="option.linkedField.type" placeholder="请选择">
												<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
												</el-select>
											</el-form-item>
											<el-form-item label="联动字段标签" :label-width="'100px'" class="link-field">
												<el-input v-model="option.linkedField.label" autocomplete="off" placeholder="请输入联动字段标签"></el-input>
											</el-form-item>
											<!-- 联动字段类型为单选 -->
											<div v-if="option.linkedField.type === 'radio' || option.linkedField.type === 'checkbox'">
												<el-form-item label="选项设置" :label-width="'100px'" class="link-field">
												<div v-for="(op, i) in option.linkedField.options" :key="i" class="option-item">
													<el-input
													type="text"
													v-model="option.linkedField.options[i]"
													placeholder="选项文本"
													class="option-input"
													/>
													<div style="line-height: 32px;"><el-icon @click="removeLinkOption(index, i)"><Delete /></el-icon></div>
												</div>
												<el-button @click="addLinkOption(index)">添加联动选项</el-button>
												</el-form-item>
											</div>
										</div>
									</div>
									<el-button @click="addOption(index)">添加选项</el-button>
									</el-form-item>
								</div>
								<el-button @click="addField" class="add-field-btn">添加字段</el-button>
							</el-form>
					</el-form>
				</div>
				<!-- 表单预览 -->
				<div class="preview-form">
					<div class="preview-title"><b>表单预览</b></div>
					<el-form size="small" :model="form" ref="form">
						<el-form-item v-for="field in formFields" :key="field.id" :label="field.label" :label-width="formLabelWidth">
							<!-- 文本框类型 -->
							<el-input v-if="field.type === 'text'" :placeholder="`请输入${field.label}`"></el-input>
							<!-- 单选框类型 -->
							<div v-if="field.type === 'radio'">
								<el-radio-group v-for="(option, optIndex) in field.options" v-model="selectedRadioOptions[field.id]">
									<el-radio :value="option.id" @change="handleRadioChange(field, option)" style="margin-right: 20px;">{{ option.detail }}</el-radio>
								</el-radio-group>
								<!-- 联动字段 -->
								<div v-for="(option, optIndex) in field.options">
									<div v-if="option.id === selectedRadioOptions[field.id] && option.hasLinkedField">
										<el-form-item :label="option.linkedField.label" :label-width="'30px'">
											<!-- 联动类型为文本框 -->
											<div v-if="option.linkedField.type==='text'">
											<el-input
												type="text"
												:placeholder="'请输入' + option.linkedField.label"
											/>
											</div>
											<!-- 联动类型为单选 -->
											<div v-if="option.linkedField.type==='radio'">
											<el-radio-group v-for="(item, i) in option.linkedField.options">
												<el-radio :value="i" style="margin-right: 15px;">{{ item }}</el-radio>
											</el-radio-group>
											</div>
											<!-- 联动类型为多选 -->
											<div v-if="option.linkedField.type==='checkbox'">
											<el-checkbox-group v-for="(item, i) in option.linkedField.options">
												<el-checkbox :value="i">{{ item }}</el-checkbox>
											</el-checkbox-group>
											</div>
										</el-form-item>
									</div>
								</div>
							</div>
							<!-- 多选框类型 -->
							<div v-if="field.type === 'checkbox'">
								<el-checkbox-group v-for="(option, optIndex) in field.options" v-model="formValues[field.id]">
									<el-checkbox :value="optIndex">{{ option.detail }}</el-checkbox>
								</el-checkbox-group>
							</div>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<!--提交-->
			<div class="common-button-wrapper">
				<el-button size="small" type="info" @click="cancelFunc">取消</el-button>
				<el-button size="small" type="primary" @click="onSubmit" :loading="loading">保存</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
	import { v4 as uuid } from "uuid";
	import CourseApi from '@/api/course.js';
	import EnrollApi from "../../../api/enroll";
	export default {
		components: {},
		data() {
			return {
				activeName: 'basic',
				/*是否正在加载*/
				loading: false,
				form: {
					title: '',
					stime: '',
					etime: '',
					newField: {
						type: "text",
						label: "",
						options: [
						{
							detail: "选项1",
							hasLinkedField: false,
							id: "",
							linkedField: {
							id: "",
							label: "",
							type: "text",
							options: ["选项1", "选项2"]
							}
						},
						{
							detail: "选项2",
							hasLinkedField: false,
							id: "",
							linkedField: {
							id: "",
							label: "",
							type: "text",
							options: ["选项1", "选项2"]
							}
						}
						],
						id: ""
					}
				},
				// 字段类型选项
				options: [
					{
						value: 'text',
						label: '文本框'
					},
					{
						value: 'radio',
						label: '单选框'
					},
					{
						value: 'checkbox',
						label: '多选框'
					}
				],
				formRules: {
					title: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}],
					stime: [{
						required: true,
						message: '请选择开始时间',
						trigger: 'blur'
					}],
					etime: [{
						required: true,
						message: '请选择截止时间',
						trigger: 'blur'
					}],
					'newField.type': [{
						required: true,
						message: '请选择字段类型',
						trigger: 'blur'
					}],
					'newField.label': [{
						required: true,
						message: '请输入字段标签',
						trigger: 'blur'
					}],
					'newField.linkedField.label': [{
						required: true,
						message: '请输入联动字段标签',
						trigger: 'blur'
					}],
					'newField.linkedField.optionIndex': [{
						required: true,
						message: '请选择关联选项',
						trigger: 'blur'
					}]
				},
				// 表单值
				formValues: {},
				formFields: [],
				// 单选框选中状态
				selectedRadioOptions: {},
				/*左边长度*/
				formLabelWidth: '80px',
			};
		},
		provide: function() {
			return {
				form: this.form
			}
		},
		created() {},
		methods: {
			// 添加字段
			addField() {
				let self = this;
				let params = self.form;
				self.$refs.form.validate((valid) => {
				if (valid) {
					if (!params.newField.label) {
					ElMessage({
						message: '请输入字段标签',
						type: 'error'
					});
					return;
					}
					if (
					(params.newField.type === "radio" || params.newField.type === "checkbox") &&
					params.newField.options.length === 0
					) {
					ElMessage({
						message: '单选/多选类型至少需要一个选项',
						type: 'warning'
					});
					return;
					}

					// 设置字段ID
					const fieldId = "field_" + uuid();
					this.form.newField.id = fieldId;
					// 设置选项ID
					if (this.form.newField.type === "radio" || this.form.newField.type === "checkbox") {
					for (let item of this.form.newField.options) {
						item.id = "" + uuid();
					}
					}
					// 复制新字段数据
					const fieldData = JSON.parse(JSON.stringify(this.form.newField));
					// 添加到表单字段
					console.log('新表单字段', fieldData);
					this.formFields.push(fieldData);

					// 重置新字段
					this.resetNewField();

				} else {
					// 验证不通过，Element 会自动显示错误提示
					console.log('验证不通过');
					return false;
				}
				});
			},
			// 重置新字段
			resetNewField () {
				this.form.newField.type = "text";
				this.form.newField.label = "";
				this.form.newField.id = "";
				this.form.newField.options = [
				{
					detail: "选项1",
					hasLinkedField: false,
					linkedField: {
					id: "",
					label: "",
					type: "text",
					options: ["选项1", "选项2"]
					}
				},
				{
					detail: "选项2",
					hasLinkedField: false,
					linkedField: {
					id: "",
					label: "",
					type: "text",
					options: ["选项1", "选项2"]
					}
				}
				];
			},
			// 添加选项
			addOption(index) {
				this.form.newField.options.push({
					detail: "新选项",
					hasLinkedField: false,
					linkedField: {
						id: "",
						label: "",
						type: "text",
						options: ["选项1", "选项2"]
					}
				});
			},
			// 添加联动选项
			addLinkOption(index) {
				this.form.newField.options[index].linkedField.options.push("新选项");
			},
			// 处理单选框变更
			handleRadioChange (field, option) {
				this.selectedRadioOptions[field.id] = option.id;
			},
			// 移除选项
			removeOption (index) {
				this.form.newField.options.splice(index, 1);
			},
			// 移除联动字段选项
			removeLinkOption(index, i) {
				this.form.newField.options[index].linkedField.options.splice(i, 1)
			},
			/*转JSON字符串*/
			convertJson(list) {
				let obj = {};
				list.forEach(item => {
					obj[item.grade_id] = item.product_equity;
				});
				return JSON.stringify(obj);
			},

			/*提交*/
			onSubmit() {
				let self = this;
				let params = {
					// id: this.form.id,
					title: this.form.title,
					stime: new Date(this.form.stime).getTime() / 1000,
          			etime: new Date(this.form.etime).getTime() / 1000,
					data_excel: JSON.stringify(self.formFields)
				}
				console.log("formFields:", params);
				EnrollApi.enrollAdd(params).then(data => {
					self.loading = false;
					ElMessage({
						message: '创建成功',
						type: 'success'
					});
					self.dialogFormVisible(true);
					console.log("data:", data);
				}).catch(error => {
					self.loading = false;
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
	.product-add {
		padding-bottom: 100px;
	}
	.edit-dialog {
		display: flex;
		margin-top: 8px;
	}
	.edit-form {
		width: calc(50% + 15px);
		border-right: solid 1px #e6e6e6;
		padding-right: 15px;
	}
	.preview-form {
		flex: 1;
		margin-left: 15px;
	}
	.edit-title, .preview-title {
		text-align: center;
		margin-bottom: 10px;
		margin-top: 5px;
	}
	.add-field-btn {
		display: block;
		margin: 0 auto;
	}
	.option-item {
		display: flex;
		margin-bottom: 8px;
		.option-input {
			margin-right: 5px;
		}
	}
	.link-field {
		margin-left: -30px;
	}
</style>