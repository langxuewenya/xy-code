<template>

	<div>
		<div class="common-seach-wrap">
			<el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
				<el-form-item label="兑换码">
					<el-input size="small" v-model="searchForm.code_no" placeholder="提货码"></el-input>
				</el-form-item>
				<el-form-item label="使用状态">
					<el-select size="small" v-model="searchForm.use_status" placeholder="请选择">
						<el-option label="全部" value=""></el-option>
						<el-option label="未使用" value="0"></el-option>
						<el-option label="已使用" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-select size="small" v-model="searchForm.status" placeholder="请选择">
						<el-option label="全部" value=""></el-option>
						<el-option label="有效" value="0"></el-option>
						<el-option label="失效" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属活动">
					<el-select size="small" v-model="searchForm.exchange_id" filterable placeholder="请选择">
						<el-option label="全部" value=""></el-option>
						<el-option v-for="(item, index) in exchangeList" :key="index" :label="item.title"
							:value="item.exchange_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" icon="Search" @click="onSubmit">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="success" @click="onExport"
						v-auth="'/plus/exchange/code/export'">导出</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table-wrap">
			<el-table :data="tableData" style="width: 100%" v-loading="loading">
				<el-table-column prop="code_no" label="兑换码"></el-table-column>
				<el-table-column prop="code_pwd" label="兑换密码"></el-table-column>
				<el-table-column prop="title" label="所属卡券"></el-table-column>
				<el-table-column prop="use_status" label="使用状态">
					<template #default="scope">
						<span v-if="scope.row.use_status == 0" class="gray">未使用</span>
						<span v-if="scope.row.use_status == 1" class="green">已使用</span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态">
					<template #default="scope">
						<span v-if="scope.row.status == 1" class="gray">失效</span>
						<span v-if="scope.row.status == 0" class="green">有效</span>
					</template>
				</el-table-column>
				<el-table-column prop="user" label="用户">
					<template #default="scope">
						<span v-if="scope.row.user">{{scope.row.user.nickName}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="user" label="订单号">
					<template #default="scope">
						<span v-if="scope.row.orderM">{{scope.row.orderM.order_no}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="user" label="使用时间">
					<template #default="scope">
						<span v-if="scope.row.use_time">{{scope.row.use_time}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="create_time" label="添加时间"></el-table-column>
				<el-table-column fixed="right" label="操作" width="100">
					<template #default="scope">
						<el-button v-if="scope.row.use_status == 0" v-auth="'/plus/exchange/code/edit'"
							@click="editClick(scope.row)" type="text" size="small">编辑</el-button>
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
	import qs from 'qs';
	import {
		useUserStore
	} from '@/store';
	const {
		token
	} = useUserStore();
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
					code_no: '',
					exchange_id: '',
					use_status: '',
					status: '',
					token,
				},
				exchangeList: [],
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
				let Params = self.searchForm;
				Params.page = self.curPage;
				Params.list_rows = self.pageSize;
				ExchangeApi.codelist(Params, true)
					.then(res => {
						self.loading = false;
						self.tableData = res.data.list.data;
						self.totalDataNumber = res.data.list.total;
						self.exchangeList = res.data.exchangeList;
					})
					.catch(error => {
						self.loading = false;
					});
			},
			/*编辑*/
			editClick(row) {
				let params = row.code_id;
				this.$router.push({
					path: '/plus/exchange/code/edit',
					query: {
						code_id: params
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

			/*搜索查询*/
			onSubmit() {
				this.curPage = 1;
				this.tableData = [];
				this.getTableList();
			},

			onExport: function() {
				let baseUrl = window.location.protocol + '//' + window.location.host;
				window.location.href = baseUrl + '/index.php/shop/plus.exchange.code/export?' + qs.stringify(this
					.searchForm);
			},

			handleClick(tab, event) {},
		}
	};
</script>

<style></style>