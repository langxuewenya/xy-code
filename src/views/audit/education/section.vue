<template>

	<div class="product-list">
		<!--搜索表单-->
		<div class="common-seach-wrap">
			<el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
				<el-form-item label="课时名称">
					<el-input size="small" v-model="searchForm.search" placeholder="请输入课时名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" icon="Search" @click="onSubmit">查询</el-button>
				</el-form-item>
				<el-form-item>
				  <el-button size="small" type="info" @click="cancelFunc">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!--内容-->
		<div class="product-content">
			<div class="table-wrap">
				<el-table size="small" :data="tableData" border style="width: 100%" v-loading="loading">
					<el-table-column prop="title" label="课时名称"></el-table-column>
					<el-table-column prop="is_see" label="试看">
						 <template #default="scope">
   						 {{ scope.row.is_see === 0 ? '否' : '是' }}
  						</template>
					</el-table-column>
					<el-table-column prop="play_count" label="观看人数"></el-table-column>
					<el-table-column prop="is_show" label="状态">
						<template #default="scope">
							<span v-if="scope.row.is_show==0">显示</span>
							<span v-if="scope.row.is_show==1">隐藏</span>
						</template>
					</el-table-column>
					<el-table-column prop="sort" label="排序"></el-table-column>
					<el-table-column fixed="right" label="操作" width="120">
						<template #default="scope">
							<el-button @click="editClick(scope.row)" type="text" size="small"
								v-auth="'/audit/education/sectionDetail'">查看
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<!--分页-->
		<div class="pagination">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
				:current-page="curPage" :page-size="pageSize" layout="total, prev, pager, next, jumper"
				:total="totalDataNumber"></el-pagination>
		</div>
	</div>
</template>

<script>
	import AuditApi from '@/api/audit.js';
	export default {
		components: {},
		data() {
			return {
				/*是否正在加载*/
				loading: true,
				/*一页多少条*/
				pageSize: 10,
				/*一共多少条数据*/
				totalDataNumber: 0,
				/*当前是第几页*/
				curPage: 1,
				/*搜索参数*/
				searchForm: {
					search: '',
					category_id: ''
				},
				/*列表数据*/
				tableData: [],
				/*全部分类*/
				categoryList: [],
			};
		},
		mounted() {
			/*获取列表*/
			this.course_id = this.$route.query.course_id;
			this.getData();
		},
		methods: {
			/*选择第几页*/
			handleCurrentChange(val) {
				let self = this;
				self.loading = true;
				self.curPage = val;
				self.getData();
			},

			/*每页多少条*/
			handleSizeChange(val) {
				this.pageSize = val;
				this.getData();
			},

			/*切换菜单*/
			handleClick(tab, event) {
				let self = this;
				self.curPage = 1;
				self.getData();
			},

			/*获取列表*/
			getData() {
				let self = this;
				let Params = self.searchForm;
				Params.page = self.curPage;
				Params.course_id = self.course_id;
				Params.list_rows = self.pageSize;
				self.loading = true;
				AuditApi.educationSectionList(Params, true)
					.then(data => {
						self.loading = false;
						self.tableData = data.data.list.data;
						self.categoryList = data.data.category;
						self.totalDataNumber = data.data.list.total;
					})
					.catch(error => {
						self.loading = false;
					});
			},
			/*搜索查询*/
			onSubmit() {
				this.curPage = 1;
				this.getData();
			},
			/*打开编辑*/
			editClick(row) {
				this.$router.push({
					path: '/audit/education/sectionDetail',
					query: {
						section_id: row.section_id,
						course_id: this.course_id,
						scene: 'edit'
					}
				});
			},
			/*取消*/
			cancelFunc() {
			  this.$router.back(-1);
			}
		}
	};
</script>

<style></style>