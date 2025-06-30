<template>
	<el-dialog title="对话记录" v-model="dialogVisible" @close="cancelFunc" :close-on-click-modal="false"
		:close-on-press-escape="false" :append-to-body="true" width="800px">
		<!--内容-->
		<div class="product-content">
			<div class="table-wrap">
				<el-table size="small" :data="tableData" border style="width: 100%" v-loading="loading">
					<el-table-column label="发送人昵称">
						<template #default="scope">
							<div v-if="scope.row.msg_type==1">
								<span v-if="scope.row.server">{{scope.row.server.nick_name}}</span>
							</div>
							<div v-else><span v-if="scope.row.user">{{scope.row.user.nickName}}</span></div>
						</template>
					</el-table-column>
					<el-table-column label="发送人头像" width="100">
						<template #default="scope">
							<div v-if="scope.row.msg_type==1">
								<el-image v-if="scope.row.server" style="width: 30px; height: 30px"
									:src="scope.row.server.avatarUrl" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
									:preview-src-list="[scope.row.server.avatarUrl]" :initial-index="0" fit="cover" />
							</div>
							<div v-else>
								<el-image v-if="scope.row.user" style="width: 30px; height: 30px"
									:src="scope.row.user.avatarUrl" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
									:preview-src-list="[scope.row.user.avatarUrl]" :initial-index="0" fit="cover" />
							</div>

						</template>
					</el-table-column>
					<el-table-column prop="content" label="发送消息">
						<template #default="scope">
							<div v-if="scope.row.type == 0">
								<span>{{ scope.row.content }}</span>
							</div>
							<div v-if="scope.row.type == 1">
								<el-image style="width: 100px; height: 100px" :src="scope.row.content" :zoom-rate="1.2"
									:max-scale="7" :min-scale="0.2" :preview-src-list="[scope.row.content]"
									:initial-index="0" fit="cover" />
							</div>
							<div v-if="scope.row.type == 2">
								<el-image style="width: 50px; height: 50px"
									:src="JSON.parse(scope.row.content).product_img" :zoom-rate="1.2" :max-scale="7"
									:min-scale="0.2" :preview-src-list="[JSON.parse(scope.row.content).product_img]"
									:initial-index="0" fit="cover" />
								<div class="pro_txtname nmaxwidth">
									{{ JSON.parse(scope.row.content).product_name }}
								</div>
								<div class="pro_price">
									￥{{ JSON.parse(scope.row.content).product_price }}
								</div>
							</div>
							<div class="d-s-c" v-if="scope.row.type == 3">
								<div>
									<el-image style="width: 50px; height: 50px"
										:src="JSON.parse(scope.row.content).product_img" :zoom-rate="1.2" :max-scale="7"
										:min-scale="0.2" :preview-src-list="[JSON.parse(scope.row.content).product_img]"
										:initial-index="0" fit="cover" />
								</div>
								<div>
									<div class="pro_txtname nmaxwidth">
										订单号：{{ JSON.parse(scope.row.content).order_no }}
									</div>
									<div class="pro_txtname nmaxwidth">
										商品名称:{{ JSON.parse(scope.row.content).product_name }}
									</div>
									<div class="pro_price">
										订单价格:￥{{ JSON.parse(scope.row.content).order_price }}
									</div>
									<div class="pro_price">
										商品数量：{{ JSON.parse(scope.row.content).order_num }}
									</div>
									<div class="pro_txtname nmaxwidth">
										下单时间：{{ JSON.parse(scope.row.content).create_time }}
									</div>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="create_time" label="发送时间" width="140"></el-table-column>
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
	</el-dialog>
</template>

<script>
	import ChatApi from '@/api/chat.js';
	export default {
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
				user_id: null,
				/*搜索表单对象*/
				formInline: {

				},
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
					this.user_id = this.model.user_id;
					if (this.chat_user_id && this.user_id) {
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
				params.user_id = self.user_id;
				ChatApi.chatRecord(params, true).then(res => {
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