<template>

	<div class="product">

		<!--添加产品分类-->
		<div class="common-level-rail">
			<el-button size="small" type="primary" @click="addClick" icon="Plus"
				v-auth="'/paper/train/category/add'">添加分类
			</el-button>
		</div>

		<!--内容-->
		<div class="product-content">
			<div class="table-wrap">
				<el-table size="small" :data="tableData" style="width: 100%" v-loading="loading">
					<el-table-column prop="category_id" label="ID"></el-table-column>
					<el-table-column prop="name" label="分类名称" width="180"></el-table-column>
					<el-table-column prop="questionCount" label="考试数量"></el-table-column>
					<el-table-column prop="sort" label="排序" width="80"></el-table-column>
					<el-table-column prop="status" label="状态">
						<template #default="scope">
							<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
								@change="catSet($event,scope.row.category_id)">
							</el-switch>
						</template>
					</el-table-column>
					<el-table-column prop="create_time" label="添加时间"></el-table-column>
					<el-table-column fixed="right" label="操作" width="100">
						<template #default="scope">
							<el-button @click="editClick(scope.row)" type="text" size="small"
								v-auth="'/paper/train/category/edit'">编辑
							</el-button>
							<el-button @click="deleteClick(scope.row)" type="text" size="small"
								v-auth="'/paper/train/category/delete'">删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>

		<!--添加-->
		<Add v-if="open_add" :open_add="open_add" @closeDialog="closeDialogFunc($event, 'add')">
		</Add>
		<!--修改-->
		<Edit v-if="open_edit" :open_edit="open_edit" :editform="categoryModel" @closeDialog="closeDialogFunc($event, 'edit')"></Edit>

	</div>
</template>

<script>
	import PaperApi from '@/api/paper.js';
	import Add from './Add.vue';
	import Edit from './Edit.vue';
	export default {
		components: {
			Add,
			Edit
		},
		data() {
			return {
				/*是否加载完成*/
				loading: true,
				/*列表数据*/
				tableData: [],
				/*是否打开添加弹窗*/
				open_add: false,
				/*是否打开编辑弹窗*/
				open_edit: false,
				/*当前编辑的对象*/
				categoryModel: {}
			};
		},
		created() {
			/*获取列表*/
			this.getData();
		},
		methods: {

			/*获取列表*/
			getData() {
				let self = this;
				PaperApi.traincatList({}, true)
					.then(data => {
						self.loading = false;
						self.tableData = data.data.list;
					})
					.catch(error => {
						self.loading = false;
					});
			},
			/*打开添加*/
			addClick() {
				this.open_add = true;
			},

			/*打开编辑*/
			editClick(item) {
				this.categoryModel = item;
				this.open_edit = true;
			},
			catSet(e, id) {
				let self = this;
				PaperApi.traincatSet({
					category_id: id,
					status: e
				}).then(data => {
					ElMessage({
						message: data.msg,
						type: 'success'
					});
					// self.getData();
				});
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
			/*删除分类*/
			deleteClick(row) {
				let self = this;
				ElMessageBox.confirm('删除后不可恢复，确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					PaperApi.traincatDel({
						category_id: row.category_id
					}).then(data => {
						ElMessage({
							message: '删除成功',
							type: 'success'
						});
						self.getData();
					});
				});
			},
		}
	};
</script>

<style></style>