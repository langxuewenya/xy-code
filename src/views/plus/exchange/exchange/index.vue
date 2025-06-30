<template>

	<div>
		<div class="common-level-rail"><el-button size="small" type="primary" icon="Plus"
				v-auth="'/plus/exchange/exchange/add'" @click="addClick">添加活动</el-button></div>
		<div class="table-wrap">
			<el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
				<el-form-item label="活动名称">
					<el-input size="small" v-model="searchForm.title" placeholder="活动名称"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-select size="small" v-model="searchForm.status" placeholder="请选择">
						<el-option label="全部" value=""></el-option>
						<el-option label="生效" value="10"></el-option>
						<el-option label="未生效" value="20"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="课程名称">
					<el-select size="small" filterable v-model="searchForm.course_id" placeholder="请选择">
						<el-option label="全部" value=""></el-option>
						<el-option v-for="(item, index) in courseList" :key="index" :label="item.title"
							:value="item.course_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="时间">
					<div class="block">
						<span class="demonstration"></span>
						<el-date-picker size="small" v-model="searchForm.create_time" type="daterange"
							value-format="YYYY-MM-DD" range-separator="至" start-placeholder="开始日期"
							end-placeholder="结束日期"></el-date-picker>
					</div>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" icon="Search" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="tableData" style="width: 100%" v-loading="loading">
				<el-table-column prop="exchange_id" label="活动ID" width="60"></el-table-column>
				<el-table-column prop="card_title" label="活动名称">
					<template #default="scope">
						<div class="text-ellipsis" :title="scope.row.title">{{scope.row.title}}</div>
					</template>
				</el-table-column>
				<el-table-column prop="course.title" label="课程名称">
					<template #default="scope">
						<div class="text-ellipsis" v-if="scope.row.course">{{scope.row.course.title}}</div>
					</template>
				</el-table-column>
				<el-table-column prop="total_num" label="兑换码总数"></el-table-column>
				<el-table-column prop="use_num" label="使用数量"></el-table-column>
				<el-table-column prop="sort" label="排序"></el-table-column>
				<el-table-column prop="content" label="描述"></el-table-column>
				<el-table-column prop="status" label="状态">
					<template #default="scope">
						<el-switch v-model="scope.row.status" :active-value="10" :inactive-value="20"
							@change="ExchangeSet($event, scope.row.exchange_id)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column prop="create_time" label="添加时间"></el-table-column>
				<el-table-column fixed="right" label="操作" width="160">
					<template #default="scope">
						<el-button v-if="scope.row.status==10" @click="codeClick(scope.row)"
							v-auth="'/plus/exchange/exchange/code'" type="text" size="small">生成码</el-button>
						<el-button @click="editClick(scope.row)" v-auth="'/plus/exchange/exchange/edit'" type="text"
							size="small">编辑</el-button>
						<el-button @click="deleteClick(scope.row)" v-auth="'/plus/exchange/exchange/delete'" type="text"
							size="small">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!--分页-->
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
					:current-page="curPage" :page-size="pageSize" layout="total, prev, pager, next, jumper"
					:total="totalDataNumber"></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import ExchangeApi from '@/api/exchange.js';
	export default {
		components: {},
		data() {
			return {
				/*分类*/
				categoryData: [],
				/*表单数据*/
				tableData: [],
				/*是否打开添加弹窗*/
				open_add: false,
				/*是否打开编辑弹窗*/
				open_edit: false,
				/*当前编辑的对象*/
				userModel: {},
				commentData: [],
				loading: true,
				/*一页多少条*/
				pageSize: 20,
				/*一共多少条数据*/
				totalDataNumber: 0,
				/*当前是第几页*/
				curPage: 1,
				/*横向表单数据模型*/
				searchForm: {
					title: '',
					course_id: '',
					status: '',
					create_time: ''
				},
				courseList: []
			};
		},
		created() {
			/*获取文章列表*/
			this.getTableList();
		},
		methods: {
			/*搜索查询*/
			onSubmit() {
				this.curPage = 1;
				this.tableData = [];
				this.getTableList();
			},
			/*获取文章列表*/
			getTableList() {
				let self = this;
				let Params = self.searchForm;
				Params.page = self.curPage;
				Params.list_rows = self.pageSize;
				ExchangeApi.exchangelist(Params, true)
					.then(data => {
						self.loading = false;
						self.tableData = data.data.list.data;
						self.totalDataNumber = data.data.list.total;
						self.courseList = data.data.course;
					})
					.catch(error => {
						self.loading = false;
					});
			},

			/*添加兑换码*/
			addClick() {
				this.$router.push({
					path: '/plus/exchange/exchange/add'
				});
			},

			/*编辑*/
			editClick(row) {
				let params = row.exchange_id;
				this.$router.push({
					path: '/plus/exchange/exchange/edit',
					query: {
						exchange_id: params
					}
				});
			},

			/*生成码*/
			codeClick(row) {
				let params = row.exchange_id;
				this.$router.push({
					path: '/plus/exchange/exchange/code',
					query: {
						exchange_id: params
					}
				});
			},

			/*选择第几页*/
			handleCurrentChange(val) {
				let self = this;
				self.curPage = val;
				self.loading = true;
				self.getTableList();
			},

			/*每页多少条*/
			handleSizeChange(val) {
				this.curPage = 1;
				this.pageSize = val;
				this.getTableList();
			},
			ExchangeSet(e, id) {
				let self = this;
				ExchangeApi.setExchange({
					exchange_id: id,
					status: e
				}).then(data => {
					ElMessage({
						message: data.msg,
						type: 'success'
					});
					// self.getData();
				});
			},
			/*删除*/
			deleteClick(row) {
				let self = this;
				ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						self.loading = true;
						ExchangeApi.deleteExchange({
									exchange_id: row.exchange_id
								},
								true
							)
							.then(data => {
								ElMessage({
									message: data.msg,
									type: 'success'
								});
								self.loading = false;
								self.getTableList();
							})
							.catch(error => {});
					})
					.catch(() => {});
			},
			handleClick(tab, event) {},
		}
	};
</script>

<style></style>