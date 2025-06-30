<template>
	<div class="user">
		<div class="common-seach-wrap">
			<el-form size="small" :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="账号状态">
					<el-select v-model="formInline.status" placeholder="全部">
						<el-option label="全部" value="-1"></el-option>
						<el-option label="正常" value="1"></el-option>
						<el-option label="关闭" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="关键字"><el-input v-model="formInline.search"
						placeholder="请输入客服账号或名称"></el-input></el-form-item>
				<el-form-item><el-button type="primary" @click="onSubmit">查询</el-button></el-form-item>
			</el-form>
		</div>

		<div class="common-seach-wrap">
			<div class="common-level-rail">
				<el-button size="small" type="primary" icon="Plus" @click="addClick"
					v-auth="'/chat/chat/add'">添加客服</el-button>
			</div>
		</div>
		<!--内容-->
		<div class="product-content">
			<div class="table-wrap">
				<el-table size="small" :data="tableData" border style="width: 100%" v-loading="loading">
					<el-table-column prop="chat_user_id" label="客服ID"></el-table-column>
					<el-table-column label="客服头像" width="100">
						<template #default="scope">
							<img v-img-url="scope.row.avatarUrl" :width="40" :height="40" />
						</template>
					</el-table-column>
					<el-table-column prop="user_id" label="用户ID"></el-table-column>
					<el-table-column prop="nickName" label="用户昵称">
						<template #default="scope">
							<span v-if="scope.row.user">{{scope.row.user.nickName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="user_name" label="客服账号"></el-table-column>
					<el-table-column prop="nick_name" label="客服名称"></el-table-column>
					<el-table-column prop="status" label="状态">
						<template #default="scope">
							<el-switch @change="onSaleChange($event, scope.row)" v-model="scope.row.status"
								:active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column prop="sort" label="排序" width="140"></el-table-column>
					<el-table-column prop="create_time" label="创建时间" width="140"></el-table-column>
					<el-table-column fixed="right" label="操作" width="220">
						<template #default="scope">
							<el-button @click="gotoBench(scope.row)" type="text" size="small"
								v-auth="'/chat/chat/workbench'">工作台</el-button>
							<el-button @click="editClick(scope.row)" type="text" size="small"
								v-auth="'/chat/chat/edit'">编辑</el-button>
							<el-button @click="deleteClick(scope.row)" type="text" size="small"
								v-auth="'/chat/chat/delete'">删除</el-button>
							<el-button @click="userList(scope.row)" type="text" size="small"
								v-auth="'/chat/chat/list'">聊天记录</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<!--分页-->
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
					:current-page="curPage" :page-size="pageSize" layout="total, prev, pager, next, jumper"
					:total="totalDataNumber"></el-pagination>
			</div>
		</div>
		<Add :open="open_add" @close="closeAdd"></Add>
		<Edit :open="open_edit" :model="curModel" @close="closeEdit"></Edit>
		<List :open="open_list" :model="curModel" @close="closeList"></List>
	</div>
</template>

<script>
	import ChatApi from '@/api/chat.js';
	import Add from "./dialog/Add.vue";
	import Edit from "./dialog/Edit.vue";
	import List from "./dialog/userList.vue";
	import {
		setCookie
	} from '@/utils/base.js';

	export default {
		components: {
			Add,
			Edit,
			List
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
				/*横向表单数据模型*/
				formInline: {
					status: '-1',
					search: '',
				},
				/*是否打开添加弹窗*/
				open_add: false,
				/*是否打开编辑弹窗*/
				open_edit: false,
				open_list: false,
				curModel: {},
				/*当前编辑的对象*/
				userModel: {}
			};
		},
		created() {
			/*获取列表*/
			this.getTableList();
		},
		methods: {
			gotoBench(row) {
				ElMessageBox.confirm('此操作将离开当前页，去往客服窗口, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					ChatApi.workbench({
							chat_user_id: row.chat_user_id
						}, ).then(data => {
							const {
								data: {
									data: {
										loginServiceUserVo,
										token,
										shopLogo,
										shopName,
										socketUrl
									}
								}
							} = data;
							setCookie('targetServiceToken', token)
							let obj = Object.assign(loginServiceUserVo, {
								shopLogo,
								shopName
							})
							setCookie('targetUserInfo', JSON.stringify(obj))
							setCookie('socketUrl', socketUrl)
							// 本地测试
							// window.open(`http://127.0.0.1:5176/#/transfer/getToken`, '_blank');
							// 正式中
							window.open(`/service/#/transfer/getToken`, '_blank');
						})
						.catch(error => {
							ElMessage.error('失败');
						});
				}).catch(() => {
					ElMessage({
						type: 'info',
						message: '已取消'
					});
				});
			},
			/*搜索*/
			searchSubmit() {
				this.curPage = 1;
				this.getTableList();
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
			//搜索
			onSubmit() {
				let self = this;
				self.loading = true;
				self.getTableList();
			},

			/*获取列表*/
			getTableList() {
				let self = this;
				let Params = self.formInline;
				Params.page = self.curPage;
				Params.list_rows = self.pageSize;
				ChatApi.chatIndex(Params, true)
					.then(res => {
						self.loading = false;
						self.tableData = res.data.list.data;
						self.totalDataNumber = res.data.list.total;
					})
					.catch(error => {
						self.loading = false;
					});
			},
			onSaleChange(e, row) {
				let self = this;
				let params = {
					chat_user_id: row.chat_user_id,
				};
				ChatApi.editStatus(params, true)
					.then(res => {
						if (res.code == 1) {
							ElMessage({
								message: '操作成功',
								type: 'success'
							});
							self.getData();
							self.loading = false;
						}
					})
					.catch(error => {});
			},

			/*打开添加*/
			addClick() {
				this.open_add = true;
			},
			closeAdd(e) {
				this.open_add = false;
				if (e && e.type == 'success') {
					this.getTableList();
				}
			},

			/*打开编辑*/
			editClick(row) {
				this.curModel = row;
				this.open_edit = true;
			},
			closeEdit(e) {
				this.open_edit = false;
				if (e && e.type == 'success') {
					this.getTableList();
				}
			},

			/*打开聊天用户*/
			userList(row) {
				this.curModel = row;
				this.open_list = true;
			},
			closeList(e) {
				this.open_list = false;
				if (e && e.type == 'success') {
					this.getTableList();
				}
			},

			/*打开编辑*/
			recordClick(row) {
				let self = this;
				let params = row.userId;
				this.$router.push({
					path: '/chat/chat/record',
					query: {
						userId: params
					}
				});
			},

			/*删除*/
			deleteClick(row) {
				let self = this;
				ElMessageBox.confirm('此操作将永久删除该客服, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						ChatApi.chatdelete({
									chat_user_id: row.chat_user_id
								},
								true
							)
							.then(data => {
								ElMessage({
									message: '恭喜你，客服删除成功',
									type: 'success'
								});
								self.getTableList();
							})
							.catch(error => {});
					})
					.catch(() => {});
			}
		}
	};
</script>

<style></style>