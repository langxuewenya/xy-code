<template>
	
	<div class="product">
		<!--搜索表单-->
		<div class="common-seach-wrap">
			<el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
				<el-form-item label="评价">
					<el-select size="small" v-model="searchForm.score" placeholder="">
						<el-option label="全部" :value="0"></el-option>
						<el-option v-for="(item,index) in commentList" :key="index" :label="item.name"
							:value="item.val">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="课程名称">
					<el-input size="small" v-model="searchForm.name" placeholder="请输入课程名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" icon="Search" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!--内容-->
		<div class="product-content">
			<div class="table-wrap">
				<el-tabs v-model="activeName" @tab-change="handleClick">
					<el-tab-pane label="全部评价" name="-1"></el-tab-pane>
					<el-tab-pane :label="'待审核('+num+')'" name="0"></el-tab-pane>
					<el-tab-pane label="审核通过" name="1"></el-tab-pane>
					<el-tab-pane label="审核未通过" name="2"></el-tab-pane>
				</el-tabs>
				<el-table size="small" :data="tableData" border style="width: 100%" v-loading="loading">
					<el-table-column label="课程" width="400px">
						<template #default="scope">
							<div class="product-info">
								<div class="pic"><img v-img-url="scope.row.course.image.file_path" alt="" /></div>
								<div class="info">
									<div class="name">{{scope.row.course.title}}</div>
									<div class="price">￥{{scope.row.course.course_price}}</div>
									<div class="name" v-if="scope.row.order_id>0">订单号:{{scope.row.orderM.order_no}}
									</div>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="user.nickName" label="用户"></el-table-column>
					<el-table-column prop="score" label="评分">
						<template #default="scope">
							<span v-if="scope.row.score==10" class="red">好评</span>
							<span v-else-if="scope.row.score==20" class="orange">中评</span>
							<span v-else-if="scope.row.score==30" class="gray">差评</span>
						</template>
					</el-table-column>
					<el-table-column prop="content" label="评价内容" width="200">
						<template #default="scope">
							<p class="ww100 text-ellipsis-2">{{scope.row.content}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="is_picture" label="图片">
						<template #default="scope">
							<span v-if="scope.row.is_picture==0">没有</span>
							<span v-else>有</span>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="评价状态">
						<template #default="scope">
							<span v-if="scope.row.status==0" class="red fb">待审核</span>
							<span v-if="scope.row.status==1" class="green">审核通过</span>
							<span v-if="scope.row.status==2" class="gray9">审核未通过</span>
						</template>
					</el-table-column>
					<el-table-column prop="sort" label="排序"></el-table-column>
					<el-table-column prop="create_time" label="评论时间"></el-table-column>
					<el-table-column fixed="right" label="操作" width="90">
						<template #default="scope">
							<el-button @click="detailClick(scope.row)" type="text" size="small"
								v-auth="'/course/comment/detail'">详情
							</el-button>
							<el-button @click="delClick(scope.row)" type="text" size="small"
								v-auth="'/course/comment/delete'">删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!--分页-->
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
					:current-page="curPage" :page-size="pageSize" layout="total, prev, pager, next, jumper"
					:total="totalDataNumber">
				</el-pagination>
			</div>
		</div>

	</div>
</template>

<script>
	import CourseApi from '@/api/course.js';
	export default {
		components: {},
		data() {
			return {
				loading: true,
				activeName: '-1',
				num: 0,
				/*列表数据*/
				tableData: [],
				/*一页多少条*/
				pageSize: 20,
				/*总条数*/
				totalDataNumber: 0,
				/*当前是第几页*/
				curPage: 1,
				/*搜索参数*/
				searchForm: {
					score: 0,
					name: ''
				},
				/*评价等级*/
				commentList: [{
						name: '好评',
						val: 10
					},
					{
						name: '中评',
						val: 20
					},
					{
						name: '差评',
						val: 30
					},
				],
			};
		},
		props: ['course_id'],
		mounted() {
			/*获取列表*/
			this.getData();
		},
		methods: {

			/*选择第几页*/
			handleCurrentChange(val) {
				let self = this;
				self.curPage = val;
				self.loading = true;
				let Params = self.searchForm;
				self.getData(Params);
			},

			/*每页多少条*/
			handleSizeChange(val) {
				this.curPage = 1;
				this.pageSize = val;
				this.getData();
			},
			/*获取列表*/
			getData(param = '') {
				let self = this;
				let Params = {};
				Params.status = self.activeName;
				Params.page = self.curPage;
				Params.course_id = self.course_id;
				Params.list_rows = self.pageSize;
				if (param != '') {
					Params.score = param.score;
					Params.name = param.name;
				}
				CourseApi.getCommentList(Params, true).then(res => {
					self.loading = false;
					self.tableData = res.data.list.data;
					self.totalDataNumber = res.data.list.total
					self.num = res.data.num;
				}).catch(error => {
					self.loading = false;
				});
			},

			/*打开编辑*/
			detailClick(row) {
				this.$router.push({
					path: '/course/comment/Detail',
					query: {
						comment_id: row.comment_id,
					}
				});
			},

			/*删除*/
			delClick: function(row) {
				let self = this;
				ElMessageBox.confirm('删除后不可恢复，确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					CourseApi.delComment({
						comment_id: row.comment_id
					}).then(data => {
						ElMessage({
							message: '删除成功',
							type: 'success'
						});
						self.getData();
					});
				});
			},

			/*搜索查询*/
			onSubmit() {
				let self = this;
				self.loading = true;
				let Params = self.searchForm;
				Params.page = self.curPage;
				Params.list_rows = self.pageSize;
				CourseApi.getCommentList(Params, true).then(data => {
					self.loading = false;
					self.tableData = data.data.list.data;
					self.totalDataNumber = data.data.list.total
				}).catch(error => {
					self.loading = false;
				});
			},

			/*切换选项卡*/
			handleClick(tab, event) {
				let self = this;
				self.curPage = 1;
				self.getData();
			},
		}
	};
</script>

<style></style>