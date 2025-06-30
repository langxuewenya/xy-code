<template>

	<div>
		<div class="common-level-rail">
			<el-button size="small" type="primary" icon="Plus" v-auth="'/service/service/add'" @click="addService">添加消息</el-button>
		</div>
		<div class="table-wrap">
			<el-table :data="tableData" style="width: 100%" v-loading="loading">
				<el-table-column prop="service_id" label="ID" width="60"></el-table-column>
				<el-table-column prop="title" label="标题">
					<template #default="scope">
						<div class="text-ellipsis" :title="scope.row.title">{{scope.row.title}}</div>
					</template>
				</el-table-column>
				<el-table-column prop="category.name" label="分类" width="120"></el-table-column>
				<el-table-column prop="sort" label="消息排序" width="100"></el-table-column>
				<el-table-column prop="status" label="状态" width="100">
					<template #default="scope">
						<span v-if="scope.row.status == 1" class="green">显示</span>
						<span v-if="scope.row.status == 0" class="gray">隐藏</span>
					</template>
				</el-table-column>
				<el-table-column prop="create_time" label="添加时间" width="140"></el-table-column>
				<el-table-column prop="update_time" label="更新时间" width="140"></el-table-column>
				<el-table-column prop="name" label="操作" width="150">
					<template #default="scope">
						<el-button @click="editService(scope.row)" v-auth="'/service/service/edit'" type="text"
							size="small">编辑</el-button>
						<el-button @click="deleteService(scope.row)" v-auth="'/service/service/delete'" type="text"
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
	import ServiceApi from '@/api/service.js';
	export default {
		components: {},
		data() {
			return {
				/*分类*/
				categoryData: [],
				/*表单数据*/
				tableData: [],
				loading: true,
				/*一页多少条*/
				pageSize: 20,
				/*一共多少条数据*/
				totalDataNumber: 0,
				/*当前是第几页*/
				curPage: 1
			};
		},
		created() {
			/*获取文章列表*/
			this.getTableList();
		},
		methods: {
			/*获取文章列表*/
			getTableList() {
				let self = this;
				let Params = {};
				Params.page = self.curPage;
				Params.list_rows = self.pageSize;
				ServiceApi.servicelist(Params, true)
					.then(data => {
						self.loading = false;
						self.tableData = data.data.list.data;
						self.totalDataNumber = data.data.list.total;
					})
					.catch(error => {
						self.loading = false;
					});
			},
			/*添加消息*/
			addService() {
				this.$router.push({
					path: '/service/service/add'
				});
			},
			/*编辑消息*/
			editService(row) {
				let params = row.service_id;
				this.$router.push({
					path: '/service/service/edit',
					query: {
						service_id: params
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
			/*删除消息*/
			deleteService(row) {
				let self = this;
				ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						self.loading = true;
						ServiceApi.deleteService({
									service_id: row.service_id
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