<template>

	<div class="user">
		<!--搜索表单-->
		<div class="common-seach-wrap">
			<el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
				<el-form-item label="会员卡名称">
					<el-input v-model="formInline.card_name" placeholder="请输入会员卡名称" size="small"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="formInline.status" placeholder="请选择" size="small">
						<el-option label="全部" :value="-1"></el-option>
						<el-option label="启用" :value="1"></el-option>
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
			<el-button size="small" type="primary" @click="addClick" icon="Plus" v-auth="'/card/card/add'">添加会员卡
			</el-button>
		</div>
		<!--内容-->
		<div class="product-content">
			<div class="table-wrap">
				<el-table size="small" :data="tableData" border style="width: 100%" v-loading="loading">
					<el-table-column prop="card_id" label="ID"></el-table-column>
					<el-table-column prop="card_name" label="名称"></el-table-column>
					<!-- <el-table-column prop="card_image" label="图片">
						<template #default="scope">
							<img :src="scope.row.card_image" :width="30" :height="30" />
						</template>
					</el-table-column> -->
					<el-table-column prop="expire" label="有效期">
						<template #default="scope">
							<span v-if="scope.row.expire>0">{{scope.row.expire}}天</span>
							<span v-else>永久有效</span>
						</template>
					</el-table-column>
					<el-table-column prop="line_money" label="原价"></el-table-column>
					<el-table-column prop="money" label="销售价格"></el-table-column>
					<el-table-column prop="receive_num" label="领取数量">
						<template #default="scope">
							<span>{{scope.row.receive_num}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态">
						<template #default="scope">
							<span v-if="scope.row.status==1">启用</span>
							<span v-else>关闭</span>
						</template>
					</el-table-column>
					<el-table-column prop="sort" label="排序"></el-table-column>
					<el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
					<el-table-column fixed="right" label="操作" width="170">
						<template #default="scope">
							<el-button @click="putClick(scope.row)" type="primary" size="small" link
								v-auth="'/card/card/put'">发卡</el-button>
							<el-button @click="editClick(scope.row)" type="primary" size="small" link
								v-auth="'/card/card/edit'">编辑
							</el-button>
							<el-button @click="deleteClick(scope.row)" type="primary" size="small" link
								v-auth="'/card/card/delete'">删除
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
		<!--发卡-->
		<Put v-if="open_edit" :open_edit="open_edit" :form="userModel" @closeDialog="closeDialogFunc($event, 'edit')">
		</Put>
	</div>
</template>

<script>
	import CardApi from '@/api/card.js';
	import Put from './dialog/put.vue';
	import {
		deepClone
	} from '@/utils/base.js';
	export default {
		components: {
			Put
		},
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
					card_name: '',
					status: -1
				},
				/*是否打开编辑弹窗*/
				open_edit: false,
				/*当前编辑的对象*/
				userModel: {},
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
				CardApi.cardlist(Params, true)
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
				this.$router.push('/card/card/add');
			},
			/*打开编辑*/
			editClick(item) {
				this.$router.push({
					path: '/card/card/edit',
					query: {
						card_id: item.card_id,
					}
				});
			},
			/*打开编辑*/
			putClick(item) {
				this.userModel = item;
				this.open_edit = true;
			},

			/*关闭弹窗*/
			closeDialogFunc(e, f) {
				if (f == 'edit') {
					this.open_edit = e.openDialog;
					if (e.type == 'success') {
						this.getTableList();
					}
				}
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
					CardApi.deletecard({
							card_id: row.card_id
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