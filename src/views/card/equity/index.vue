<template>

	<div class="user">
		<!--搜索表单-->
		<div class="common-seach-wrap">
			<el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
				<el-form-item label="名称">
					<el-input v-model="formInline.name" placeholder="请输入名称" size="small"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="formInline.status" placeholder="请选择" size="small">
						<el-option label="全部" :value="-1"></el-option>
						<el-option label="开启" :value="1"></el-option>
						<el-option label="关闭" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" icon="Search" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!--添加等级-->
		<div class="common-level-rail">
			<el-button size="small" type="primary" @click="addClick" icon="Plus" v-auth="'/card/equity/add'">添加
			</el-button>
		</div>
		<!--内容-->
		<div class="product-content">
			<div class="table-wrap">
				<el-table size="small" :data="tableData" border style="width: 100%" v-loading="loading">
					<el-table-column prop="equity_id" label="ID"></el-table-column>
					<el-table-column prop="name" label="名称"></el-table-column>
					<el-table-column prop="card_image" label="图片">
						<template #default="scope">
							<img :src="scope.row.image" :width="50" :height="50" />
						</template>
					</el-table-column>
					<!-- <el-table-column prop="describe" label="描述"></el-table-column> -->
					<el-table-column prop="status" label="状态">
						<template #default="scope">
							<span v-if="scope.row.status==1">开启</span>
							<span v-else>关闭</span>
						</template>
					</el-table-column>
					<el-table-column prop="sort" label="排序"></el-table-column>
					<el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
					<el-table-column fixed="right" label="操作" width="170">
						<template #default="scope">
							<el-button @click="editClick(scope.row)" type="primary" size="small" link
								v-auth="'/card/equity/edit'">编辑
							</el-button>
							<el-button @click="deleteClick(scope.row)" type="primary" size="small" link
								v-auth="'/card/equity/delete'">删除
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
	import CardApi from '@/api/card.js';
	import {
		deepClone
	} from '@/utils/base.js';
	export default {
		components: {},
		data() {
			return {
				/*是否加载完成*/
				loading: true,
				/*列表数据*/
				tableData: [],
				/*一页多少条*/
				pageSize: 20,
				/*一共多少条数据*/
				totalDataNumber: 0,
				/*当前是第几页*/
				curPage: 1,
				/*横向表单数据模型*/
				formInline: {
					name: '',
					status: -1
				},
			};
		},
		created() {
			/*获取列表*/
			this.getTableList();
		},
		methods: {
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

			/*获取列表*/
			getTableList() {
				let self = this;
				let Params = self.formInline;
				Params.page = self.curPage;
				Params.list_rows = self.pageSize;
				CardApi.equitylist(Params, true)
					.then(data => {
						self.loading = false;
						self.tableData = data.data.list.data;
						self.totalDataNumber = data.data.list.total;
					})
					.catch(error => {

					});
			},
			/*搜索查询*/
			onSubmit() {
				let self = this;
				self.loading = true;
				self.curPage = 1;
				self.getTableList();
			},
			/*打开添加*/
			addClick() {
				this.$router.push('/card/equity/add');
			},
			/*打开编辑*/
			editClick(item) {
				this.$router.push({
					path: '/card/equity/edit',
					query: {
						equity_id: item.equity_id,
					}
				});
			},
			/*删除用户*/
			deleteClick(row) {
				let self = this;
				ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					self.loading = true;
					CardApi.deleteEquity({
							equity_id: row.equity_id
						}, true)
						.then(data => {
							self.loading = false;
							if (data.code == 1) {
								ElMessage({
									message: data.msg,
									type: 'success'
								});
								self.getTableList();
							} else {
								ElMessage.error('错了哦，这是一条错误消息');
							}
						})
						.catch(error => {
							self.loading = false;
						});

				}).catch(() => {

				});
			}

		}
	};
</script>

<style></style>