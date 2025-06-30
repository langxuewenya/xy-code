<template>
	<div>
		<el-dialog title="新增" v-model="dialogVisible" @close="cancelFunc" :close-on-click-modal="false"
			:close-on-press-escape="false" width="70%">
			<el-form :model="formData" ref="formData">
				<el-form-item label="选择用户" :label-width="formLabelWidth" :rules="[{ required: true, message: '请选择会员' }]"
					prop="user_id">
					<el-row>
						<el-button @click="addClick" type="primary" icon="Plus">选择会员</el-button>
						<div v-if="formData.user_id!=''" class="img">
							<img :src="user_info.avatarUrl" width="80" height="80" />
							<span>{{user_info.nickName}}(ID:{{user_info.user_id}})</span>
						</div>
					</el-row>
				</el-form-item>
				<el-form-item label="姓名" :label-width="formLabelWidth" :rules="[{ required: true, message: '请输入姓名' }]"
					prop="real_name">
					<el-input type="text" v-model="formData.real_name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号" :label-width="formLabelWidth" :rules="[{ required: true, message: '请输入手机号' }]"
					prop="mobile">
					<el-input type="text" v-model="formData.mobile" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="推荐人ID" :label-width="formLabelWidth">
					<el-input type="text" v-model="formData.referee_id" autocomplete="off"></el-input>
					<div class="tips">如果没有上级则设置为0</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="cancelFunc">取 消</el-button>
					<el-button type="primary" @click="confirmFunc">确 定</el-button>
				</div>
			</template>
		</el-dialog>
		<!--添加-->
		<GetUser :is_open="open_user" @close="closeDialogFunc"></GetUser>
	</div>
</template>

<script>
	import GetUser from '@/components/user/GetUser.vue';
	import PlusApi from '@/api/plus.js';
	export default {
		components: {
			/*编辑组件*/
			GetUser
		},
		data() {
			return {
				/*左边长度*/
				formLabelWidth: '100px',
				/*是否显示*/
				dialogVisible: false,
				/*表单数据模型*/
				formData: {
					user_id: '',
					referee_id: 0
				},
				user_info: {},
				open_user: false,
			};
		},
		props: {
			open_add: Boolean
		},
		watch: {
			open_add: function(n, o) {
				if (n != o) {
					this.dialogVisible = this.open_add;
				}
			}
		},
		created() {},
		methods: {
			/*修改用户*/
			confirmFunc() {
				let self = this;
				let params = {};
				params.user_id = self.formData.user_id;
				params.real_name = self.formData.real_name;
				params.mobile = self.formData.mobile;
				params.referee_id = self.formData.referee_id;
				self.$refs.formData.validate(valid => {
					if (valid) {
						PlusApi.agentUserAdd(params, true)
							.then(res => {
								ElMessage({
									message: '恭喜你，新增成功',
									type: 'success'
								});
								self.cancelFunc(true);
							})
							.catch(error => {});
					} else {
						ElMessage({
							message: '请检查必填项是否填写完整',
							type: 'error'
						});
					}
				});
			},
			/*关闭弹窗*/
			cancelFunc(e) {
				let type = 'cancel';
				if (e) {
					type = 'success';
				}
				this.$emit('close', {
					type: type
				});
				this.formData.user_id = '';
				this.formData.real_name = '';
				this.formData.mobile = '';
				this.formData.referee_id = 0;
			},
			/*打开弹出层*/
			addClick() {
				this.open_user = true;
			},

			/*关闭获取用户弹窗*/
			closeDialogFunc(e) {
				if (e && e.type != 'error') {
					this.user_info = e.params[0];
					this.formData.user_id = e.params[0].user_id;
				}
				this.open_user = false;
			},

		}
	};
</script>

<style></style>