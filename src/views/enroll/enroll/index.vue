<template>

	<div class="product-list">
		<!--搜索表单-->
		<div class="common-seach-wrap">
			<el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="报名表名称">
					<el-input size="small" v-model="searchForm.do" placeholder="请输入报名表名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" icon="Search" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!--创建报名-->
		<!-- <div class="common-level-rail">
			<el-button size="small" type="primary" icon="Plus" @click="addClick" v-auth="'/enroll/enroll/addnew'">
				创建报名
			</el-button>
		</div> -->
		<!--内容-->
		<div class="product-content">
			<div class="table-wrap">
				<el-table size="small" :data="tableData" border style="width: 100%" v-loading="loading">
					<el-table-column prop="title" label="名称"></el-table-column>
					<el-table-column prop="stime" label="开始时间"></el-table-column>
					<el-table-column prop="etime" label="截止时间"></el-table-column>
					<!-- <el-table-column prop="data_excel " label="表单内容">
						<template #default="scope">
                            <div></div>
						</template>
					</el-table-column> -->
					<el-table-column prop="pep_num" label="报名人数"></el-table-column>
					<el-table-column prop="time" label="创建时间"></el-table-column>
					<el-table-column prop="name" label="创建人"></el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template  #default="scope">
                            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2"
                                @change="statusSet($event,scope.row.id)">
                            </el-switch>
                        </template>
                    </el-table-column>
					<el-table-column fixed="right" label="操作" width="120">
						<template #default="scope">
							<div>
								<el-button @click="editClick(scope.row)" type="text" size="small">
									编辑
								</el-button>
							</div>
							<!-- <div>
								<el-button @click="delClick(scope.row)" type="text" size="small"
									v-auth="'/lecturer/lecturer/delete'">
									删除讲师
								</el-button>
							</div> -->
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
        <!--修改-->
        <Edit v-if="open_edit" :open_edit="open_edit" :editform="categoryModel"
        @closeDialog="closeDialogFunc($event, 'edit')"></Edit>
	</div>
</template>

<script>
	import LecturerApi from '@/api/lecturer.js';
	import EnrollApi from '@/api/enroll.js';
    import Edit from './Edit.vue';
	export default {
        components: {
            Edit
        },
		data() {
			return {
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
					do: ''
				},
				/*列表数据*/
				tableData: [],
                /*是否打开编辑弹窗*/
                open_edit: false,
                /*当前编辑的对象*/
                categoryModel: {
                    catList: [],
                    model: {}
                }
			};
		},
		created() {
			/*获取列表*/
			this.getData();
		},
		methods: {
			addClick() {
				this.$router.push({
					path: '/enroll/enroll/addnew',
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

			/*获取列表*/
			getData() {
				let self = this;
				let Params = self.searchForm;
                console.log(Params);
				Params.page = self.curPage;
				Params.list_rows = self.pageSize;
				self.loading = true;
				EnrollApi.enrollList(Params, true)
					.then(data => {
                        console.log(data);
						self.loading = false;
						self.tableData = data.data.list;
						self.totalDataNumber = data.data.count;
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
			// editClick(row) {
			// 	this.$router.push({
			// 		path: '/lecturer/lecturer/edit',
			// 		query: {
			// 			lecturer_id: row.lecturer_id,
			// 			scene: 'edit'
			// 		}
			// 	});
			// },
            /*打开编辑*/
            editClick(item) {
                this.categoryModel.model = item;
                this.open_edit = true;
                console.log(this.categoryModel.model);
            },
            /*关闭弹窗*/
            closeDialogFunc(e, f) {
                if (f == 'add') {
                this.open_add = e.openDialog;
                if (e.type == 'success') {
                    this.getData();
                }
                }
                if (f == 'edit') {
                this.open_edit = e.openDialog;
                if (e.type == 'success') {
                    this.getData();
                }
                }
            },
            /*状态设置*/
			statusSet(e, id) {
                console.log(e, id);
				let self = this;
				EnrollApi.statusChange({
					bid: id,
					dostatus: e
				}).then(data => {
					ElMessage({
						message: data.msg,
						type: 'success'
					});
					self.getData();
				});
			},
			/*删除*/
			delClick: function(row) {
				let self = this;
				ElMessageBox.confirm('删除后不可恢复，确定删除该记录吗?', '提示', {
						type: 'warning'
					})
					.then(() => {
						LecturerApi.delLecturer({
							lecturer_id: row.lecturer_id
						}).then(data => {
							ElMessage({
								message: '删除成功',
								type: 'success'
							});
							self.getData();
						});
					});
			}
		}
	};
</script>

<style></style>