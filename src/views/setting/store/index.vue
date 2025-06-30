<template>

	<div class="product-add" v-loading="loading">
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="平台设置" name="plate"></el-tab-pane>
			<el-tab-pane label="会员设置" name="user"></el-tab-pane>
			<el-tab-pane label="讲师设置" name="teacher"></el-tab-pane>
		</el-tabs>
		<!--form表单-->
		<el-form size="small" ref="form" :model="form" label-width="150px">
			<!--平台设置-->
			<Plate v-show="activeName == 'plate'"></Plate>
			<!--会员设置-->
			<User v-show="activeName == 'user'"></User>
			<!--讲师设置-->
			<Teacher v-show="activeName == 'teacher'"></Teacher>

			<div class="common-button-wrapper">
				<el-button type="primary" @click="onSubmit" :loading="loading">提交</el-button>
			</div>
		</el-form>
		<!--上传图片-->
		<Upload v-if="isupload" :isupload="isupload" :type="type" :config="{ total: 3 }" @returnImgs="returnImgsFunc">
		</Upload>

	</div>

</template>

<script>
	import SettingApi from '@/api/setting.js';
	import Upload from '@/components/file/Upload.vue';
	import {
		formatModel
	} from '@/utils/base.js';
	import {
		useUserStore
	} from '@/store';
	const {
		changShop
	} = useUserStore();
	import Plate from './part/Plate.vue';
	import User from './part/User.vue';
	import Teacher from './part/Teacher.vue';
	export default {
		components: {
			Upload,
			Plate,
			User,
			Teacher
		},
		data() {
			return {
				activeName: 'plate',
				/*是否正在加载*/
				loading: false,
				/*form表单数据*/
				form: {
					name: '',
					iap: 20,
					is_get_log: 0,
					avatarUrl: '',
					add_course_audit: '',
					edit_course_audit: '',
					add_edu_audit: '',
					edit_edu_audit: '',
					add_exam_audit: '',
					edit_exam_audit: '',
					add_train_audit: '',
					edit_train_audit: '',
					lecturer_image: '',
					customer: '',
					key: '',
					lectuer_sms_open: '',
					logoUrl: '',
					sms_open: '',
					wx_open: '',
					wx_phone: '',
					mp_open: '',
					user_name: '',
					login_logo: '',
					login_desc: '',
					mp_phone: ''
				},
			};
		},
		provide: function() {
			return {
				form: this.form
			}
		},
		created() {
			this.getParams()
		},
		methods: {
			/*获取配置数据*/
			getParams() {
				let self = this;
				SettingApi.storeDetail({}, true).then(res => {
						let vars = res.data.vars.values;
						self.form = formatModel(self.form, vars);
						self.form.customer = vars.kuaidi100.customer;
						self.form.key = vars.kuaidi100.key;
						self.loading = false;
					})
					.catch(error => {

					});
			},

			/*提交*/
			onSubmit() {
				let self = this;
				let params = this.form;
				self.$refs.form.validate((valid) => {
					if (valid) {
						self.loading = true;
						SettingApi.editStore(params, true)
							.then(data => {
								self.loading = false;
								ElMessage({
									message: '恭喜你，商城设置成功',
									type: 'success'
								});
								changShop(params.name);
								self.$router.push('/setting/store/index');
							})
							.catch(error => {
								self.loading = false;
							});
					}
				});

			},
		}

	};
</script>
<style>
	.tips {
		color: #ccc;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}

	input[type="number"] {
		-moz-appearance: textfield;
	}
</style>