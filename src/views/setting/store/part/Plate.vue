<template>
	<div class="basic-setting-content pl16 pr16">
		<!--基本信息-->
		<div class="common-form">平台设置</div>
		<el-form-item label="平台名称" :rules="[{required: true,message: ' '}]" prop="name">
			<el-input v-model="form.name" placeholder="平台名称" class="max-w460"></el-input>
		</el-form-item>
		<el-form-item label="苹果支付方式：" prop="iap">
		  <el-radio-group v-model="form.iap">
		    <el-radio label="10">普通支付</el-radio>
		    <el-radio label="20">苹果内购</el-radio>
		  </el-radio-group>
		  <div class="tips">注：只对IOS有效</div>
		</el-form-item>
		<el-form-item label="平台LOGO" :rules="[{required: true,message: ' '}]" prop="name">
			<div class="ww100">
				<el-button @click="chooseImg('logoUrl')">选择图片</el-button>
			</div>
			<img class="mt10" v-img-url="form.logoUrl" :width="100">
			<div class="gray">建议图片上传尺寸为200px*200px</div>
		</el-form-item>
		<div class="common-form">日志记录</div>
		<el-form-item label="是否记录查询日志" prop="customer">
			<el-checkbox v-model="form.is_get_log">是否记录查询日志</el-checkbox>
			<div class="tips">如果记录，日志量会有点大</div>
		</el-form-item>
		<div class="common-form">物流查询api</div>
		<el-form-item label="快递100 Customer" prop="customer">
			<el-input v-model="form.customer" placeholder="" class="max-w460"></el-input>
			<div class="tips">用于查询物流信息,<el-link :underline="false" href="https://www.kuaidi100.com/openapi/"
					target="_blank" type="primary">快递100申请</el-link>
			</div>
		</el-form-item>
		<el-form-item label="快递100 Key" prop="key">
			<el-input v-model="form.key" placeholder="" class="max-w460"></el-input>
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
		created() {},
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
					if (this.type == 'logoUrl') {
						this.form.logoUrl = e[0].file_path;
					}
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