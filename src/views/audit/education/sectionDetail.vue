<template>
	<div class="product-add" v-loading="loading">
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="基础设置" name="basic"></el-tab-pane>
			<!-- <el-tab-pane label="章节详情" name="content"></el-tab-pane> -->
		</el-tabs>
		<!--form表单-->
		<el-form size="small" ref="form" :model="form" label-width="180px" v-if="!loading">
			<!--基础信息-->
			<Basic v-show="activeName == 'basic'"></Basic>
			<!--商品详情-->
			<Content v-show="activeName == 'content'"></Content>
			<!--审核-->
			<div class="common-button-wrapper" style="height: 50px">
				<el-button size="small" type="info" @click="cancelFunc">返回</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
	import AuditApi from '@/api/audit.js';
	import Basic from './section/Basic.vue';
	import Content from './section/Content.vue';
	import {
		formatModel
	} from '@/utils/base.js';
	export default {

		components: {
			/*基础信息*/
			Basic,
			/*商品详情*/
			Content,
		},
		data() {

			return {
				activeName: 'basic',
				/* 审核状态*/
				/*商品ID*/
				course_id: 0,
				/*判断是编辑*/
				scene: 'edit',
				/*是否正在加载*/
				loading: true,
				/*是否正在提交保存*/
				save_loading: false,
				/*form表单数据*/
				form: {
					model: {},
				},
				/*模型数据*/
				model: {
					course_id: 0,
					scene: 'add',
					/*章节名称*/
					title: '',
					content: '',
					video_link: '',
					video_image: "",
					audio_image: '',
					audio_link: '',
					is_see: 0,
					see_time: 0,
					sort: 0,
					lecturer_id: '',
					back_link: '',
					start_time: '',
					end_time: '',
					lecturer: {}
				}
			};
		},
		provide: function() {
			return {
				form: this.form
			};
		},
		created() {
			/*获取列表*/
			this.section_id = this.$route.query.section_id;
			this.scene = this.$route.query.scene;
			this.getData();
		},
		methods: {
			/**
			 * 获取基础数据
			 */
			getData: function() {
				let self = this;
				AuditApi.educationSectionDetail({
							section_id: self.section_id,
							scene: self.scene
						},
						true
					)
					.then(res => {
						self.loading = false;
						Object.assign(self.form, res.data);
						self.form.model.start_time = res.data.model.start_time_text;
						self.form.model.end_time = res.data.model.end_time_text;
					})
					.catch(error => {
						self.loading = false;
					});
			},

			/*取消*/
			cancelFunc() {
				this.$router.back(-1);
			}
		}
	};
</script>

<style lang="scss" scoped>
	.basic-setting-content {}

	.product-add {
		padding-bottom: 50px;
	}

	.mb50 {
		margin-bottom: 50px;
	}
</style>