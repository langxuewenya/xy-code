<template>
	<div>
		<el-dialog title="编辑客服" v-model="dialogVisible" @close="dialogFormVisible" :close-on-click-modal="false"
			:close-on-press-escape="false" :append-to-body='true'>
			<!--form表单-->
			<el-form size="small" ref="form" :model="form" :rules="formRules" :label-width="formLabelWidth">
				<el-form-item label="用户" prop="user_name">
					<el-row>
						<el-button @click="addClick" icon="Plus">选择用户</el-button>
						<div v-if="form.user_id>0" class="img">
							<img :src="userInfo.avatarUrl" width="100" height="100" />
							<span>{{userInfo.user_id}}({{userInfo.nickName}})</span>
						</div>
					</el-row>
				</el-form-item>
				<el-form-item label="客服头像" prop="avatarUrl">
					<el-row>
						<div class="draggable-list">
							<div class="item img-select" v-if="!form.avatarUrl" @click="openProductUpload()">
								<el-icon>
									<Plus />
								</el-icon>
							</div>
							<div v-if="form.avatarUrl" class="item" @click="openProductUpload()">
								<img :src="form.avatarUrl" width="100" height="100" />
							</div>
						</div>
					</el-row>
					<div class="gray9">建议图片尺寸为240px*240px</div>
				</el-form-item>
				<el-form-item label="客服昵称" prop="nick_name">
					<el-input v-model="form.nick_name"></el-input>
				</el-form-item>
				<el-form-item label="客服账号" prop="user_name">
					<el-input v-model="form.user_name" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="客服密码" prop="password">
					<el-input v-model="form.password" placeholder="请输入确认密码" type="password" />
				</el-form-item>
				<el-form-item label="确认密码" prop="confirmPassword">
					<el-input v-model="form.confirmPassword" placeholder="请输入确认密码" type="password" />
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-input v-model="form.sort" type="number"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-radio-group v-model="form.status">
						<el-radio :label="1">开启</el-radio>
						<el-radio :label="0">关闭</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="onSubmit" :loading="loading">确 定</el-button>
				</div>
			</template>
		</el-dialog>
		<!--添加-->
		<UserSelect :is_open="open_add" @close="closeDialogFunc"></UserSelect>
		<Upload v-if="isProductUpload" :isupload="isProductUpload" @returnImgs="returnProductImgsFunc">上传图片</Upload>
	</div>
</template>

<script>
	import ChatApi from '@/api/chat.js';
	import UserSelect from '@/components/user/GetUser.vue';
	import Upload from '@/components/file/Upload.vue';

	export default {
		components: {
			Upload,
			UserSelect
		},
		data() {
			/*确认新密码验证*/
			let checkPasswordConfirm = (rule, value, callback) => {
				if (this.form.password != '' && !value) {
					callback(new Error('请填写确认密码'));
				} else if (this.form.password != '' && value !== this.form.password) {
					callback(new Error('确认密码不一致'));
				} else {
					callback();
				}
			};
			return {
				isProductUpload: false,
				/*左边长度*/
				formLabelWidth: '120px',
				/*是否显示*/
				loading: false,
				/*是否打开添加弹窗*/
				open_add: false,
				/*是否显示*/
				dialogVisible: false,
				chat_user_id: null,
				/*form表单对象*/
				form: {
					status: 1
				},
				userInfo: {},
				/*form验证*/
				formRules: {
					user_id: [{
						required: true,
						message: '用户必填',
						trigger: 'blur'
					}],
					avatarUrl: [{
						required: true,
						message: '客服头像必传',
						trigger: 'blur'
					}],
					nick_name: [{
						required: true,
						message: '客服昵称',
						trigger: 'blur'
					}],
					user_name: [{
						required: true,
						message: '客服账号必填',
						trigger: 'blur'
					}],
					confirmPassword: [{
						validator: checkPasswordConfirm,
						required: true,
						trigger: 'blur'
					}],
					sort: [{
						required: true,
						message: '排序必填',
						trigger: 'blur'
					}],
				}
			};
		},
		created() {},
		props: ['open', 'model'],
		watch: {
			open: function(n, o) {
				if (n != o) {
					this.dialogVisible = this.open;
					this.form.chat_user_id = this.model.chat_user_id;
					if (this.form.chat_user_id) {
						this.getData();
					}
				}
			}
		},
		methods: {
			openProductUpload() {
				this.isProductUpload = true;
			},
			returnProductImgsFunc(e) {
				console.log(e)
				if (e && e.length > 0) {
					this.form.avatarUrl = e[0].file_path;
				}
				this.isProductUpload = false;
			},

			/*获取详情*/
			getData() {
				let self = this;
				ChatApi.tochatedit({
						chat_user_id: self.form.chat_user_id
					}, true)
					.then(res => {
						self.form = res.data.model;
						self.form.password = '';
						self.userInfo = res.data.model.user || {};
						self.loading = false;
					})
					.catch(error => {
						console.log(error);
						self.loading = false;
					});
			},

			/*编辑*/
			onSubmit() {
				let self = this;
				self.loading = true;
				let params = self.form;
				ChatApi.chatedit(params, true)
					.then(data => {
						self.loading = false;
						ElMessage({
							message: '恭喜你，编辑成功',
							type: 'success'
						});
						self.dialogFormVisible(true);
					})
					.catch(error => {
						self.loading = false;
					});
			},
			addClick() {
				this.open_add = true;
			},
			/*关闭获取用户弹窗*/
			closeDialogFunc(e) {
				if (e && e.type != 'error') {
					this.userInfo = e.params[0];
					this.form.user_id = e.params[0].user_id;
				}
				this.open_add = false;
			},
			/*关闭弹窗*/
			dialogFormVisible(e) {
				if (e) {
					this.$emit('close', {
						type: 'success',
						openDialog: false,
					});
				} else {
					this.$emit('close', {
						type: 'error',
						openDialog: false
					});
				}
			}
		}
	};
</script>

<style></style>