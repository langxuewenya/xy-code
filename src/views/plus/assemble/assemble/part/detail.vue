<template>

	<div>
		<el-dialog title="详情" v-model="dialogVisible" @close="dialogFormVisible" :close-on-click-modal="true"
			:close-on-press-escape="false">
			<!--table-->
			<div class="mt16">
				<el-table size="small" :data="tableData" border style="width: 100%" v-loading="loading">
					<el-table-column prop="user_id" label="用户ID"></el-table-column>
					<el-table-column prop="nickName" label="微信头像">
						<template #default="scope">
							<div v-if="scope.row.user"><img class="radius" v-img-url="scope.row.user.avatarUrl"
									:width="30" :height="30" /></div>
						</template>
					</el-table-column>
					<el-table-column prop="user.nickName" label="昵称">
						<template #default="scope">
							<span v-if="scope.row.user">{{scope.row.user.nickName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="orderM.order_no" label="订单号">
						<template #default="scope">
							<span v-if="scope.row.orderM">{{scope.row.orderM.order_no}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="pid" label="团长">
						<template #default="scope">
							<span v-if="scope.row.pid==0" class="red">是</span>
							<span v-else>否</span>
						</template>
					</el-table-column>
					<el-table-column prop="is_refund" label="状态">
						<template #default="scope">
							<span v-if="scope.row.is_refund==1">已退款</span>
							<span v-else>未退款</span>
						</template>
					</el-table-column>
					<el-table-column prop="create_time" label="拼团时间"></el-table-column>
				</el-table>
			</div>

			<!--分页-->
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
					:current-page="curPage" :page-size="pageSize" layout="total, prev, pager, next, jumper"
					:total="totalDataNumber"></el-pagination>
			</div>

		</el-dialog>
	</div>
</template>

<script>
	import AssembleApi from '@/api/assemble.js';
	export default {
		data() {
			return {
				/*是否显示*/
				dialogVisible: false,
				/*是否正在加载*/
				loading: true,
				/*当前第几级*/
				level: '1',
				/*列表数据*/
				tableData: [],
				/*一页多少条*/
				pageSize: 20,
				/*一共多少条数据*/
				totalDataNumber: 0,
				/*当前是第几页*/
				curPage: 1
			};
		},
		props: {
			open_dialog: Boolean,
			assemble_id: Object
		},
		watch: {
			open_dialog: function(n, o) {
				if (n != o) {
					this.dialogVisible = this.open_dialog;
					if (n) {
						this.getData();
					}
				}
			}
		},
		created() {

		},
		methods: {

			/*切换等级*/
			changFunc(e) {
				this.getData();
			},

			/*选择第几页*/
			handleCurrentChange(val) {
				let self = this;
				self.curPage = val;
				self.loading = true;
				self.getData();
			},

			/*获取数据*/
			getData() {
				let self = this;
				let Params = {};
				Params.page = self.curPage;
				Params.list_rows = self.pageSize;
				Params.assemble_id = self.assemble_id;
				AssembleApi.assembleDetail(Params, true)
					.then(data => {
						self.loading = false;
						self.tableData = data.data.list.data;
						self.totalDataNumber = data.data.list.total;
					})
					.catch(error => {});
			},

			/*每页多少条*/
			handleSizeChange(val) {
				this.curPage = 1;
				this.pageSize = val;
				this.getData();
			},

			/*关闭弹窗*/
			dialogFormVisible(e) {
				this.$emit('close', {});
			}
		}
	};
</script>

<style scoped>
	.el-dialog__body {
		padding: 10px 20px;
	}
</style>