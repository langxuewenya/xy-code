<template>

	<el-dialog title="选择课程" v-model="dialogVisible" @close="dialogFormVisible" :modal-append-to-body="true"
		append-to-body :close-on-click-modal="false" :close-on-press-escape="false" width="900px">
		<div class="common-seach-wrap">
			<el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
				<el-form-item label="课程名称">
					<el-input placeholder="请输入课程名称" v-model="formInline.search">
						<!--  <el-select v-model="formInline.status" #prepend placeholder="请选择课程状态" style="width: 80px;">
              <el-option label="全部" value="-1"></el-option>
                <el-option v-for="(item,index) in status" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>-->
					</el-input>
				</el-form-item>
				<el-form-item label="">
					<el-button icon="Search" @click="getData">查询</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!--内容-->
		<div class="product-content">
			<div class="table-wrap">
				<el-table size="small" :data="listData" border style="width: 100%" highlight-current-row
					v-loading="loading" @selection-change="tableCurrentChange">
					<el-table-column width="70" label="课程图片">
						<template #default="scope">
							<img :src="scope.row.image && scope.row.image.file_path" width="30" height="30" />
						</template>
					</el-table-column>
					<el-table-column prop="title" label="课程名称"></el-table-column>
					<el-table-column prop="category.name" label="课程分类"></el-table-column>
					<el-table-column prop="course_type" label="类型">
						<template #default="scope">
							<span v-if="scope.row.course_type==1" class="green">课程</span>
							<span v-if="scope.row.course_type==2">教务</span>
						</template>
					</el-table-column>
					<el-table-column prop="create_time" width="140" label="添加时间"></el-table-column>
					<el-table-column type="selection" :selectable="selectableFunc" width="44"
						v-if="islist"></el-table-column>
					<el-table-column width="80" label="单选" v-if="!islist">
						<template #default="scope">
							<el-button size="mini" v-if="scope.row.noChoose"
								@click="SingleFunc(scope.row)">选择</el-button>
							<el-button size="mini" v-else disabled>已选</el-button>
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
				<el-button size="small" @click="dialogVisible=false">取 消</el-button>
				<el-button size="small" type="primary" @click="addClerk">确 定</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script>
	import DataApi from '@/api/data.js';
	export default {
		data() {
			return {
				/*是否加载完成*/
				loading: true,
				/*当前是第几页*/
				curPage: 1,
				/*一页多少条*/
				pageSize: 20,
				/*一共多少条数据*/
				totalDataNumber: 0,
				formInline: {},
				//课程分类列表
				cateList: [],
				//课程列表
				listData: [],
				//类别列表
				status: [{
						id: 10,
						name: '上架'
					},
					{
						id: 20,
						name: '下架'
					}
				],
				multipleSelection: [],
				/*左边长度*/
				formLabelWidth: '120px',
				/*是否显示*/
				dialogVisible: false,
				/*结果类别*/
				type: 'error',
				/*传出去的参数*/
				params: null
			};
		},
		props: ['iscourse', 'excludeIds', 'islist', 'course_type'],
		watch: {
			iscourse: function(n, o) {
				if (n != o) {
					if (n) {
						this.dialogVisible = n;
						this.type = 'error';
						this.params = null;
						this.getData();
					}
				}
			}
		},
		created() {

		},
		methods: {

			/*是否可以勾选*/
			selectableFunc(e) {
				if (typeof e.noChoose !== 'boolean') {
					return true;
				}
				return e.noChoose;
			},

			/*选择第几页*/
			handleCurrentChange(val) {
				this.curPage = val;
				this.getData();
			},

			/*每页多少条*/
			handleSizeChange(val) {
				this.curPage = 1;
				this.pageSize = val;
				this.getData();
			},

			/*获取课程列表*/
			getData() {
				let self = this;
				let params = self.formInline;
				params.page = self.curPage;
				params.list_rows = self.pageSize;
				params.course_type = self.course_type;
				DataApi.coursesList(params, true)
					.then(res => {
						if (res.code == 1) {
							self.loading = false;
							// self.cateList = res.data.category;
							/*判断是否需要去重*/
							if (self.excludeIds && typeof(self.excludeIds) != 'undefined' && self.excludeIds.length >
								0) {
								res.data.list.data.forEach(item => {
									if (self.excludeIds.indexOf(item.course_id) > -1) {
										item.noChoose = false;
									} else {
										item.noChoose = true;
									}
								});
							} else {
								if (!self.islist) {
									res.data.list.data.forEach(item => {
										item.noChoose = true;
									});
								}
							}
							self.listData = res.data.list.data;
							self.totalDataNumber = res.data.list.total;
						}
					})
					.catch(error => {});
			},

			/*单选*/
			SingleFunc(row) {
				this.multipleSelection = [row];
				this.addClerk();
			},

			//点击确定
			addClerk() {
				let self = this;
				let params = null;
				let type = 'success';
				if (self.multipleSelection.length < 1) {
					ElMessage({
						message: '请至少选择一件产品课程！',
						type: 'error'
					});
					return;
				}
				if (self.islist && typeof(self.islist) != 'undefined') {
					self.multipleSelection.forEach(item => {
						item.image = item.image ? item.image.file_path : '';
					});
					params = self.multipleSelection;
				} else {
					params = self.multipleSelection;
					params.image = params.image ? params.image.file_path : '';
				}
				self.params = params;
				self.type = 'success';
				self.dialogVisible = false;
			},

			/*关闭弹窗*/
			dialogFormVisible() {
				this.$emit('closeDialog', {
					type: this.type,
					openDialog: false,
					params: this.params
				});
			},

			/*监听复选按钮选中事件*/
			tableCurrentChange(val) {
				this.multipleSelection = val;
			}
		}
	};
</script>

<style>
	.no-list .el-checkbox {
		display: none;
	}
</style>