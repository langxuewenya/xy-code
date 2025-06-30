<template>
	<div class="login-bg" :style="'background-image:url(' + bgimg_url + ');'">
		<div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px"
				class="demo-ruleForm login-container d-b-c">
				<div class="log_img">
					<img :src="log_url">
				</div>
				<div class="flex-1 login-box">
					<h3 class="title" style="margin-bottom: 20px;">{{shop_name}}</h3>
					<!--用户名-->
					<el-form-item prop="username">
						<div class="left-img-input"><img class="l-img" src="/src/assets/img/user.png">
							<el-input class="l-input" type="text" v-model="ruleForm.username" auto-complete="off"
								placeholder="账号">
							</el-input>
						</div>
						<!-- <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="账号"></el-input> -->
					</el-form-item>
					<!--密码-->
					<el-form-item prop="password">
						<div class="left-img-input"><img class="l-img" src="/src/assets/img/password.png">
							<el-input type="password" class="l-input" v-model="ruleForm.password" auto-complete="off"
								placeholder="密码">
							</el-input>
						</div>
						<!-- <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input> -->
					</el-form-item>
					<el-form-item prop="code" style="line-height:0px;" v-if="codeImage">
						<div class="d-b-c">
							<div class="left-img-input" style="width: auto;">
								<el-input v-model="ruleForm.code" ref="code" placeholder="验证码" class="l-input"
									style="width:180px;"></el-input>
							</div>
							<div class="identifybox" style="height: 48px; flex-shrink: 0;margin-left: 10px;"
								@click="getData">
								<el-image class="codeImage" style="width: 150px; height: 48px" :src="codeImage" />
							</div>
						</div>
					</el-form-item>
					<!--登录-->
					<el-form-item>
						<el-button type="primary" style="width:100%;height: 51px;font-size: 18px;"
							@click.native.prevent="SubmitFunc" :loading="logining">登录
						</el-button>
					</el-form-item>
				</div>

			</el-form>
		</div>
	</div>
</template>

<script>
	import IndexApi from '@/api/index.js';
	import bgimg from '@/assets/img/login_bg.png';
	import logimg from '@/assets/img/login_logo.png';
	import UserApi from '@/api/user.js';
	import {
		useUserStore
	} from '@/store';
	const {
		afterLogin
	} = useUserStore();
	export default {
		data() {
			return {
				loginForm: {},
				codeImage: "",
				/*是否正在加载*/
				loading: true,
				/*商城名称*/
				shop_name: '',
				/*背景图片*/
				bgimg_url: '',
				/*logo图片*/
				log_url: '',
				/*是否正在提交*/
				logining: false,
				/*表单对象*/
				ruleForm: {
					/*用户名*/
					username: '',
					/*密码*/
					password: '',
					code: '',
					codeKey: '',
				},
				/*验证规则*/
				rules: {
					/*用户名*/
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					/*密码*/
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					code: [{
						required: true,
						message: "请输入验证码",
						trigger: "blur",
					}]
				},
				/*基础配置*/
				baseData: {}
			};
		},
		created() {
			this.getData();
			if (this.$route.query.from && this.$route.query.from == 'admin') {
				this.saasLogin();
			}
		},
		mounted() {},
		methods: {
			/*获取基础配置*/
			getData() {
				let self = this;
				IndexApi.base(true)
					.then(res => {
						self.loading = false;
						self.shop_name = res.data.settings.shop_name;
						if (res.data.settings.shop_bg_img != '') {
							self.bgimg_url = res.data.settings.shop_bg_img;
						} else {
							self.bgimg_url = bgimg;
						}
						if (res.data.settings.shop_logo_img != '') {
							self.log_url = res.data.settings.shop_logo_img;
						} else {
							self.log_url = logimg;
						}
						if (res.data.codeData.codeImage) self.codeImage = res.data.codeData.codeImage;
						if (res.data.codeData.codeKey) self.ruleForm.codeKey = res.data.codeData.codeKey;
					})
					.catch(error => {
						self.loading = false;
					});
			},

			/*登录方法*/
			SubmitFunc(ev) {
				var _this = this;
				this.$refs.ruleForm.validate(valid => {
					if (valid) {
						this.logining = true;
						var Params = {
							username: this.ruleForm.username,
							password: this.ruleForm.password,
							code: this.ruleForm.code,
							codeKey: this.ruleForm.codeKey
						};
						/*调用登录接口*/
						UserApi.login(Params, true)
							.then(async res => {
								this.logining = false;
								if (res.code == 1) {
									// /*保存个人信息*/
									// setCookie('userinfo', res.data);
									// /*设置一个登录状态*/
									// setCookie('isLogin', true);
									await afterLogin(res);
									/*跳转到首页*/
									this.$router.push({
										path: '/'
									});
								} else {
									ElMessage({
										message: '登录失败',
										type: 'error'
									});
								}
							})
							.catch(error => {
								if (_this.codeImage) {
									this.getData();
								}
								//接口调用方法统一处理
								this.logining = false;
							});
					}
				});
			},
			saasLogin() {
				/*调用登录接口*/
				UserApi.saasLogin({}, true)
					.then(res => {
						console.log(res);
						if (res.code == 1) {
							delCookie('baseInfo');
							/*保存个人信息*/
							setCookie('userinfo', res.data);
							/*设置一个登录状态*/
							setCookie('isLogin', true);
							/*跳转到首页*/
							this.$router.push({
								path: '/'
							});
						} else {
							ElMessage({
								message: '登录失败',
								type: 'error'
							});
						}
					}).catch(error => {
						console.log(error);
					});
			},
		}
	};
</script>

<style lang="scss">
	.login-bg {
		width: 100%;
		height: 100%;
		background: no-repeat;
		background-size: cover;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-direction: column;
		flex-direction: column;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
	}

	.login-container {
		box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.1), 0 1px 0px 0 rgba(0, 0, 0, 0.04);
		-webkit-border-radius: 5px;
		border-radius: 5px;
		-moz-border-radius: 5px;
		background-clip: padding-box;
		position: fixed;
		width: 961px;
		height: 408px;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
		background-color: #FFFFFF;

		.title {
			margin: 0px auto 40px auto;
			text-align: center;
			font-size: 28px;
			font-family: Microsoft YaHei;
			font-weight: bold;
			color: #333333;
		}

		.remember {
			margin: 0px 0px 35px 0px;
		}
	}

	.log_img {
		img {
			width: 514px;
			height: 408px;
			border-radius: 5px 0 0 5px;
		}
	}

	.login-box {
		padding: 45px 39px 31px 39px;
		height: 408px;
		box-sizing: border-box;
	}

	.left-img-input {
		width: 370px;
		height: 44px;
		line-height: 44px;
		background: #FFFFFF;
		border: 1px solid #EEEEEE;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 14px;

		.l-img {
			width: 20px;
			height: 20px;
			margin-right: 10px;
			flex-shrink: 0;
		}

		.l-input {
			flex: 1;
			border: none;
			background: none;
			font-size: 14px;
			color: #666666;

		}

		.el-input__inner {
			border: none;
			padding: 0;
		}
	}
</style>