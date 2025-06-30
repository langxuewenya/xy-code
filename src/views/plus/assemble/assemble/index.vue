<template>

	<div class="user">
		<!--搜索表单-->
		<div class="common-seach-wrap">
			<el-form size="small" :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="">
					<el-select v-model="formInline.status" placeholder="状态">
						<el-option label="全部状态" value="-1"></el-option>
						<el-option label="进行中" value="10"></el-option>
						<el-option label="已完成" value="20"></el-option>
						<el-option label="未完成" value="30"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="">
					<el-input v-model="formInline.title" placeholder="请输入产品名称"></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-input v-model="formInline.order_no" placeholder="请输入订单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="product-content">
			<el-form ref="form" :model="form" label-width="100px">
				<div class="table-wrap">
					<el-table size="small" :data="tableData" border style="width: 100%" v-loading="loading">
						<el-table-column prop="nickName" label="开团团长">
							<template #default="scope">
								<span v-if="scope.row.user">{{scope.row.user.nickName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="order_no" label="订单号">
							<template #default="scope">
								<span v-if="scope.row.orderM">{{scope.row.orderM.order_no}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="create_time" label="开团时间"></el-table-column>
						<el-table-column prop="end_time" label="结束时间"></el-table-column>
						<el-table-column prop="title" label="拼团产品">
							<template #default="scope">
								<span v-if="scope.row.course">{{scope.row.course.title}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="status" label="拼团情况">
							<template #default="scope">
								<span>{{scope.row.actual_people}}/{{scope.row.total_people}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="actual_people" label="拼团人数"></el-table-column>
						<el-table-column prop="is_virtual" label="拼团类型">
							<template #default="scope">
								<span v-if="scope.row.is_virtual==0">拼团完成</span>
								<span v-if="scope.row.is_virtual==1" class="red">虚拟完成</span>
							</template>
						</el-table-column>
						<el-table-column prop="status" label="状态">
							<template #default="scope">
								<span v-if="scope.row.status==10">进行中</span>
								<span v-if="scope.row.status==20" class="red">已完成</span>
								<span v-if="scope.row.status==30" class="green">未完成</span>
							</template>
						</el-table-column>
						<el-table-column fixed="right" label="操作" width="110">
							<template #default="scope">
								<el-button v-auth="'/plus/assemble/assemble/detail'" @click="editClick(scope.row)" type="text" size="small">详情</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-form>
			<!--分页-->
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
					:current-page="curPage" :page-size="pageSize" layout="total, prev, pager, next, jumper"
					:total="totalDataNumber">
				</el-pagination>
			</div>
		</div>
		<!--详情-->
		<assembleDetail :open_dialog="open_dialog" :assemble_id="assemble_id" @close="closeFunc"></assembleDetail>
	</div>
</template>

<script>
	import AssembleApi from '@/api/assemble.js';
	import assembleDetail from './part/detail.vue';
	export default {
		components: {
			assembleDetail
		},
		inject: ['reload'],
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
				form: {
					status: '-1',
					title: '',
					order_no: ''
				},
				/*是否打开添加弹窗*/
				open_add: false,
				/*是否打开编辑弹窗*/
				open_edit: false,
				/*当前编辑的对象*/
				userModel: {},
				formInline: {},
				/*是否打开弹窗*/
				open_dialog: false,
			};
		},
		created() {
			/*获取列表*/
			this.getTableList();

		},
		methods: {
			/*选择第几页*/
			handleCurrentChange(val) {
				this.curPage = val;
				this.getTableList();
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
				self.loading = true;
				AssembleApi.assembleList(Params, true)
					.then(data => {
						self.loading = false;
						self.tableData = data.data.list.data;
						self.totalDataNumber = data.data.list.total
					})
					.catch(error => {
						self.loading = false;
					});
			},

			/*搜索查询*/
			onSubmit() {
				this.curPage = 1;
				this.getTableList();
			},

			/*场次管理*/
			editClick(row) {
				this.assemble_id=row.assemble_id;
				this.open_dialog=true;
			},
			/*关闭下级用户弹窗*/
			closeFunc(){
			  this.open_dialog=false;
			},
		}
	};
</script>

<style></style>