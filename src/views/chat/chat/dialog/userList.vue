<template>
	<el-dialog title="聊天记录" v-model="dialogVisible" @close="cancelFunc" :close-on-click-modal="false"
		:close-on-press-escape="false" width="800px">

		<!--内容-->
		<div class="product-content">
			<div class="table-wrap">
				<el-table :data="tableData" size="small" border style="width: 100%" v-loading="loading"
					@selection-change="handleSelectionChange">
					<el-table-column prop="nickName" label="用户昵称">
						<template #default="scope">
							<span v-if="scope.row.user">{{scope.row.user.nickName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="" label="用户头像">
						<template #default="scope">
							<img v-if="scope.row.user" :src="scope.row.user.avatarUrl" class="radius" height="30" />
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="scope">
							<el-button type="primary" size="small" @click="record(scope.row)">查看对话</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<!--分页-->
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
					:current-page="curPage" :page-sizes="[2, 10, 20, 50, 100]" :page-size="pageSize"
					layout="total, prev, pager, next, jumper" :total="totalDataNumber"></el-pagination>
			</div>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button size="small" @click="dialogVisible = false">取 消</el-button>
				<el-button size="small" type="primary" @click="confirmFunc">确 定</el-button>
			</div>
		</template>
		<Record :open="open_record" :model="curModel" @close="closeRecord"></Record>
	</el-dialog>
</template>

<script>
	import ChatApi from '@/api/chat.js';
	import Record from "./record.vue";
	export default {
		components: {
			Record
		},
		data() {
			return {
				/*是否加载完成*/
				loading: true,
				/*当前是第几页*/
				curPage: 1,
				/*一页多少条*/
				pageSize: 15,
				/*一共多少条数据*/
				totalDataNumber: 0,
				chat_user_id: null,
				/*搜索表单对象*/
				formInline: {

				},
				/*是否打开查看对话弹窗*/
				open_record: false,
				/*会员等级列表*/
				gradeList: [],
				/*会员列表*/
				tableData: [],
				/*性别列表*/
				sex: ['女', '男', '未知'],
				/*选中的*/
				multipleSelection: [],
				/*是否显示*/
				dialogVisible: false
			};
		},
		props: ['open', 'model'],
		watch: {
			open: function(n, o) {
				if (n != o) {
					this.dialogVisible = n;
					this.chat_user_id = this.model.chat_user_id;
					if (this.chat_user_id) {
						this.getTableList();
					}
				}
			}
		},
		created() {},
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

			/*获取数据*/
			getTableList() {
				let self = this;
				self.loading = true;
				let params = self.formInline;
				params.page = self.curPage;
				params.list_rows = self.pageSize;
				params.chat_user_id = self.chat_user_id;
				ChatApi.chatList(params, true).then(res => {
						self.loading = false;
						self.tableData = res.data.list.data;
						self.totalDataNumber = res.data.list.total;
					})
					.catch(error => {
						self.loading = false;
					});
			},

			/*查询*/
			search() {
				this.curPage = 1;
				this.tableData = [];
				this.getTableList();
			},

			/*打开聊天用户*/
			record(row) {
				this.curModel = row;
				this.open_record = true;
			},
			closeRecord(e) {
				this.open_record = false;
				if (e && e.type == 'success') {
					this.getTableList();
				}
			},

			/*点击确定*/
			confirmFunc() {
				let params = this.multipleSelection;
				this.emitFunc(params);
			},

			/*关闭弹窗*/
			cancelFunc(e) {
				this.emitFunc();
			},

			/*发送事件*/
			emitFunc(e) {
				this.dialogVisible = false;
				if (e && typeof e != 'undefined') {
					this.$emit('close', {
						type: 'success',
						params: e
					});
				} else {
					this.$emit('close', {
						type: 'error'
					});
				}
			},

			/*监听单选按钮选中事件*/
			selectUser(val) {
				this.multipleSelection = val;
				this.confirmFunc();
			},

			/*选择用户*/
			handleSelectionChange(e) {
				this.multipleSelection = e;
			}
		}
	};
</script>

<style></style>