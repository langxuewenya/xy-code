<template>

	<div class="product-list">
		<!--搜索表单-->
		<div class="common-seach-wrap">
			<el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
				<el-form-item label="考试分类">
					<el-select size="small" v-model="searchForm.category_id" placeholder="所有分类">
						<el-option label="全部" value="0"></el-option>
						<el-option v-for="(item, index) in categoryList" :key="index" :label="item.name"
							:value="item.category_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="考试状态">
					<el-select size="small" v-model="searchForm.is_show" placeholder="考试状态">
						<el-option label="全部" :value="-1"></el-option>
						<el-option label="显示" :value="0"></el-option>
						<el-option label="隐藏" :value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="会员可见">
					<el-select size="small" v-model="searchForm.is_member" placeholder="会员可见">
						<el-option label="全部" :value="-1"></el-option>
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="考试名称">
					<el-input size="small" v-model="searchForm.search" placeholder="请输入考试名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" icon="Search" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!--添加考试-->
		<div class="common-level-rail">
			<el-button size="small" type="primary" icon="Plus" @click="addClick" v-auth="'/paper/exam/paper/add'">
				添加考试</el-button>
		</div>
		<!--内容-->
		<div class="product-content">
			<div class="table-wrap">
				<el-table size="small" :data="tableData" border style="width: 100%" v-loading="loading">
					<el-table-column prop="paper_id" label="ID"></el-table-column>
					<el-table-column prop="title" label="考试名称"></el-table-column>
					<el-table-column prop="image" label="封面">
						<template #default="scope">
							<div class="product-info">
								<div class="pic"><img v-img-url="scope.row.image.file_path" alt="" /></div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="category.name" label="考试分类"></el-table-column>
					<el-table-column prop="item_number" label="题目数量"></el-table-column>
					<el-table-column prop="money" label="价格">
						<template #default="scope">
							<span v-if="scope.row.pay_type==0">免费</span>
							<span v-else>{{scope.row.money}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="real_sales" label="会员价格">
						<template #default="scope">
							<span v-if="scope.row.pay_type==1">
								<span v-if="scope.row.member_pay==0">免费</span>
								<span v-else>{{scope.row.member_price}}</span>
							</span>
							<span v-else>免费</span>
						</template>
					</el-table-column>
					<el-table-column prop="is_member" label="会员可见">
						<template #default="scope">
							<span v-if="scope.row.is_member==0">否</span>
							<span v-else>是</span>
						</template>
					</el-table-column>
					<el-table-column prop="is_show" label="状态">
						<template #default="scope">
							<el-switch v-model="scope.row.is_show" :active-value="0" :inactive-value="1"
								@change="catSet($event, scope.row.paper_id)"></el-switch>
						</template>
					</el-table-column>
					<el-table-column prop="lecturer" label="创建讲师">
						<template #default="scope">
							<span class="green" v-if="scope.row.lecturer">{{scope.row.lecturer.name}}</span>
							<span class="red" v-else>平台</span>
						</template>
					</el-table-column>
					<el-table-column prop="sort" label="排序"></el-table-column>
					<el-table-column prop="create_time" label="创建时间"></el-table-column>
					<el-table-column fixed="right" label="操作" width="150">
						<template #default="scope">
							<el-button @click="editClick(scope.row)" type="text" size="small"
								v-auth="'/paper/exam/paper/edit'">
								编辑考试
							</el-button>
							<el-button @click="delClick(scope.row)" type="text" size="small"
								v-auth="'/paper/exam/paper/delete'">
								删除考试</el-button>
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
	import PaperApi from '@/api/paper.js';
	import qs from 'qs';
	export default {
		data() {
			return {
				isPopUp: false,
				paper_id: 0,
				/*切换菜单*/
				activeName: 'sell',
				/*切换选中值*/
				activeIndex: '0',
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
					category_id: '',
					is_show: -1,
					is_member: -1
				},
				/*列表数据*/
				tableData: [],
				/*全部分类*/
				categoryList: [],
				/*考试统计*/
				product_count: {}
			};
		},
		created() {
			/*获取列表*/
			this.getData();
		},
		methods: {
			addClick() {
				this.$router.push({
					path: '/paper/exam/paper/add',
					query: {
						scene: 'add'
					}
				});
			},
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
			onExport: function() {
				let baseUrl = window.location.protocol + '//' + window.location.host;
				window.location.href = baseUrl + '/index.php/shop/question.question/export?' + qs.stringify(this
					.searchForm);
			},
			/*获取列表*/
			getData() {
				let self = this;
				let Params = self.searchForm;
				Params.page = self.curPage;
				Params.list_rows = self.pageSize;
				self.loading = true;
				PaperApi.examPaperList(Params, true)
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
					path: '/paper/exam/paper/edit',
					query: {
						paper_id: row.paper_id,
						scene: 'edit'
					}
				});
			},
			/*删除*/
			delClick: function(row) {
				let self = this;
				ElMessageBox.confirm('确认后将永久删除，确定删除该考试吗?', '提示', {
						type: 'warning'
					})
					.then(() => {
						PaperApi.delexamPaper({
							paper_id: row.paper_id
						}).then(data => {
							ElMessage({
								message: '删除成功',
								type: 'success'
							});
							self.getData();
						});
					});
			},
			catSet(e, id) {
				let self = this;
				PaperApi.stateexamPaper({
					paper_id: id,
					state: e
				}).then(data => {
					ElMessage({
						message: data.msg,
						type: 'success'
					});
					// self.getData();
				});
			},
		}
	};
</script>

<style></style>