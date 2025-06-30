<template>

	<div class="user">
		<!--搜索表单-->
		<div class="common-seach-wrap">
			<el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
				<el-form-item label="会员卡名称">
					<el-input v-model="formInline.search" placeholder="请输入会员卡名称" size="small"></el-input>
				</el-form-item>
				<el-form-item label="会员信息">
					<el-input v-model="formInline.user_name" placeholder="请输入会员昵称|会员ID" size="small"></el-input>
				</el-form-item>
				<el-form-item label="支付方式">
					<el-select size="small" v-model="formInline.pay_type" placeholder="请选择">
						<el-option label="全部" :value="0"></el-option>
						<el-option v-for="(item, index) in pay_type" :key="index" :label="item.name"
							:value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="支付状态">
					<el-select size="small" v-model="formInline.pay_status" placeholder="请选择">
						<el-option label="全部" :value="0"></el-option>
						<el-option v-for="(item, index) in pay_status" :key="index" :label="item.name"
							:value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" icon="Search" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!--内容-->
		<div class="product-content">
			<div class="table-wrap">
				<el-table size="small" :data="tableData" border style="width: 100%" v-loading="loading">
					<el-table-column prop="order_id" label="ID"></el-table-column>
					<el-table-column prop="order_no" label="订单编号"></el-table-column>
					<el-table-column prop="user" label="用户信息">
						<template #default="scope">
							<img :src="scope.row.user.avatarUrl" width="30px" height="30px" />
							<span>{{scope.row.user.nickName}}({{scope.row.user_id}})</span>
						</template>
					</el-table-column>
					<el-table-column prop="card.card_name" label="会员卡名称"></el-table-column>
					<el-table-column prop="expire_time_text" label="有效期"></el-table-column>
					<el-table-column prop="pay_price" label="支付金额"></el-table-column>
					<el-table-column prop="pay_type_text" label="支付方式">
					</el-table-column>
					<el-table-column prop="pay_status.text" label="支付状态">
					</el-table-column>
					<el-table-column prop="pay_time_text" label="支付时间"></el-table-column>
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
					search: '',
					user_name: '',
					pay_type: 0,
					pay_status: 0
				},
				pay_type: [],
				pay_status: []
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
				CardApi.recordlist(Params, true)
					.then(data => {
						self.loading = false;
						self.tableData = data.data.list.data;
						self.totalDataNumber = data.data.list.total;
						self.pay_type = data.data.pay_type;
						self.pay_status = data.data.pay_status;
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

		}
	};
</script>

<style></style>