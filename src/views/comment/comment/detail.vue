<template>

	<div class="evaluation-detail pb50" v-loading="loading">
		<!--form表单-->
		<el-form size="small" ref="form" :model="form" label-width="120px">
			<!--添加门店-->
			<div class="common-form">课程评价详情</div>
			<el-form-item label="用户">
				<p>{{ form.user.nickName }}</p>
			</el-form-item>
			<el-form-item label="课程名称">
				<p>{{ form.course.title }}</p>
			</el-form-item>
			<el-form-item label="评价类型" v-model="form.course_type">
				<p v-if="form.course_type == 1" class="green">课程</p>
				<p v-if="form.course_type == 2" class="red">教务</p>
			</el-form-item>
			<el-form-item label="课程图片">
				<div class="d-s-c evaluation-imgs pb16">
					<div class="item"><img v-img-url="path" width="120px;" /></div>
				</div>
			</el-form-item>
			<el-form-item label="评价图片">
				<div class="d-s-c evaluation-imgs pb16">
					<div class="item" v-if="form.image.length > 0" v-for="(item, index) in form.image" :key="index"><img
							v-img-url="item.file_path" /></div>
				</div>
			</el-form-item>
			<el-form-item label="评分" v-model="form.score">
				<p v-if="form.score == 10">好评</p>
				<p v-if="form.score == 20">中评</p>
				<p v-if="form.score == 30">差评</p>
			</el-form-item>
			<el-form-item label="评价内容">
				<div>{{ form.content }}</div>
			</el-form-item>
			<el-form-item label="评论时间">
				<p>{{ form.create_time }}</p>
			</el-form-item>
			<el-form-item label="排序">
				<el-input type="number" v-model="form.sort" placeholder="请输入数字"></el-input>
			</el-form-item>
			<el-form-item label="审核">
				<el-radio-group v-model="form.status">
					<el-radio :label="1">通过</el-radio>
					<el-radio :label="2">不通过</el-radio>
				</el-radio-group>
			</el-form-item>
			<!--提交-->
			<div class="common-button-wrapper">
				<el-button size="small" type="info" @click="cancelFunc">取消</el-button>
				<el-button size="small" type="primary" @click="onSubmit">提交</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
	import CommentApi from '@/api/comment.js';
	import Upload from '@/components/file/Upload.vue';
	export default {
		components: {
			/*图片上传*/
			Upload: Upload
		},
		data() {
			return {
				/*是否上传图片*/
				isupload: false,
				is_comment: false,
				/*商品图片*/
				path: '',
				/*评论图片*/
				comment_img: '',
				/*form表单数据*/
				form: {
					user: {},
					course: {},
					image: []
				},
				loading: true
			};
		},
		created() {
			/*获取列表*/
			this.getComment();
		},
		methods: {
			/*上传*/
			openUpload() {
				this.isupload = true;
			},

			/*获取评论*/
			getComment() {
				let self = this;
				let comment_id = this.$route.query.comment_id;
				CommentApi.getComment({
							comment_id: comment_id
						},
						true
					)
					.then(data => {
						self.loading = false;
						self.form = data.data.data;
						self.path = data.data.data.course.image ? data.data.data.course.image.file_path : '';
						self.comment_id = data.data.data.comment_id;
					})
					.catch(error => {});
			},

			/*获取图片*/
			returnImgsFunc(e) {
				let self = this;
				if (e != null) {
					this.form.image_id = e[0].file_id;
					this.comment_img = e[0].file_path;
					this.is_comment = true;
				}
				this.isupload = false;
			},

			/*添加文章*/
			onSubmit() {
				let self = this;
				let params = this.form;
				CommentApi.editComment(params, true)
					.then(data => {
						if (data.code == 1) {
							ElMessage({
								message: '恭喜你，操作成功',
								type: 'success'
							});
							this.$router.back(-1);
						} else {
							ElMessage.error('错了哦，这是一条错误消息');
						}
					})
					.catch(error => {});
			},

			/*取消*/
			cancelFunc() {
				this.$router.back(-1);
			}
		}
	};
</script>

<style>
	.evaluation-detail {
		margin-bottom: 50px;
	}

	.evaluation-detail .el-form-item {
		border-bottom: 1px solid #eeeeee;
		padding-bottom: 10px;
	}

	.evaluation-detail .el-form-item__label {
		color: #bbbbbb;
	}

	.evaluation-detail .evaluation-imgs .item {
		width: 100px;
		height: 100px;
		margin-right: 4px;
		border: 1px solid #d1d5dd;
		
	}

	.evaluation-detail .evaluation-imgs .item img {
		width: 98px;
		height: 98px;
		object-fit: contain;
	}
</style>