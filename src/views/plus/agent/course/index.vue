<template>

	<div class="product-list">
		<!--搜索表单-->
		<div class="common-seach-wrap">
			<el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
				<el-form-item label="课程分类">
					<el-select size="small" v-model="searchForm.category_id" placeholder="所有分类">
						<el-option label="全部" value="0"></el-option>
						<el-option v-for="(item, index) in categoryList" :key="index" :label="item.name"
							:value="item.category_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类型">
					<el-select size="small" v-model="searchForm.course_type" placeholder="类型">
						<el-option label="全部" value="0"></el-option>
						<el-option label="课程" value="1"></el-option>
						<el-option label="教务" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="讲师">
					<el-select size="small" filterable v-model="searchForm.teacher_id" placeholder="讲师">
						<el-option label="全部" value="-1"></el-option>
						<el-option label="平台" value="0"></el-option>
						<el-option v-for="(item, index) in lecturer" :key="index" :label="item.name"
							:value="item.lecturer_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="课程名称">
					<el-input size="small" v-model="searchForm.title" placeholder="请输入课程名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" icon="Search" @click="onSubmit">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="success" @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!--内容-->
		<div class="product-content">
			<el-tabs v-model="activeName" @tab-change="handleClick">
				<el-tab-pane label="全部" name="-1">
					<template #label>
						<span>全部</span>
					</template>
				</el-tab-pane>
				<el-tab-pane label="参与" name="1">
					<template #label>
						<span>参与</span>
					</template>
				</el-tab-pane>
				<el-tab-pane label="不参与" name="0">
					<template #label>
						<span>不参与</span>
					</template>
				</el-tab-pane>
			</el-tabs>
			<div class="table-wrap">
				<el-row align="middle" style="margin-bottom: 20px">
					<el-checkbox v-model="selectAll" @change="allSelection"></el-checkbox>
					<span class="mr10 ml4">当页全选</span>
					<el-button v-auth="'/plus/agent/course/state'" size="small" type="primary" v-if="activeName != 1"
						@click="changeAgent(1)">参与推广</el-button>
					<el-button v-auth="'/plus/agent/course/state'" size="small" v-if="activeName != 0" @click="changeAgent(0)">不参与推广</el-button>
				</el-row>
				<el-table size="small" :data="tableData" border style="width: 100%" v-loading="loading"
					ref="multipleTable" @selection-change="changSelection">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column prop="title" label="课程信息" width="300px">
						<template #default="scope">
							<div class="product-info">
								<div class="pic"><img v-img-url="scope.row.image.file_path" alt="" /></div>
								<div class="info">
									<div class="name">{{ scope.row.title }}</div>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="course_type" label="类型">
						<template #default="scope">
							<div class="green" v-if="scope.row.course_type==1">课程</div>
							<div class="gray3" v-else>教务</div>
						</template>
					</el-table-column>
					<el-table-column prop="teacher" label="讲师">
						<template #default="scope">
							<div class="green" v-if="scope.row.teacher">{{scope.row.teacher.name}}</div>
							<div class="gray3" v-else>平台</div>
						</template>
					</el-table-column>
					<el-table-column prop="course_price" label="价格">
						<template #default="scope">
							<div class="gray3">￥{{ scope.row.course_price }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="real_sales" label="实际销量"></el-table-column>
					<el-table-column prop="is_agent" label="是否参与推广">
						<template #default="scope">
							<div class="green" v-if="scope.row.is_agent==1">是</div>
							<div class="gray3" v-else>否</div>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="80">
						<template #default="scope">
							<div class="table-btn-column">
								<el-button v-auth="'/plus/agent/course/edit'" @click="agentClick(scope.row)" type="text" size="small">设置</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
				<el-row align="middle" style="margin-top: 20px">
					<el-checkbox v-model="selectAll" @change="allSelection"></el-checkbox>
					<span class="mr10 ml4">当页全选</span>
					<el-button v-auth="'/plus/agent/course/state'" size="small" type="primary" v-if="activeName != 1"
						@click="changeAgent(1)">参与推广</el-button>
					<el-button v-auth="'/plus/agent/course/state'" size="small" v-if="activeName != 0" @click="changeAgent(0)">不参与推广</el-button>
				</el-row>
			</div>
		</div>
		<!--分页-->
		<div class="pagination">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
				:current-page="curPage" :page-size="pageSize" layout="total, prev, pager, next, jumper"
				:total="totalDataNumber"></el-pagination>
		</div>
		<!--添加-->
		<Agent v-if="open_agent" :open_agent="open_agent" :productModel="productModel"
			@closeDialog="closeDialogFunc($event, 'Agent')"></Agent>
	</div>
</template>

<script>
	import PlusApi from '@/api/plus.js';
	import Agent from './dialog/Agent.vue';
	export default {
		components: {
			Agent
		},
		data() {
			return {
				/*切换菜单*/
				activeName: '-1',
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
					title: '',
					course_type: '0',
					category_id: '',
					teacher_id: '-1'
				},
				/*列表数据*/
				tableData: [],
				/*全部分类*/
				categoryList: [],
				/*商品统计*/
				product_count: {},
				open_agent: false,
				productModel: {},
				selectAll: false,
				checkList: [],
				lecturer: []
			};
		},
		created() {
			/*获取列表*/
			this.getData();
		},
		methods: {
			changSelection(event) {
				this.checkList = event;
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
				self.activeName = tab;
				self.getData();
			},

			/*获取列表*/
			getData() {
				let self = this;
				let Params = self.searchForm;
				Params.page = self.curPage;
				Params.list_rows = self.pageSize;
				Params.is_agent = self.activeName;
				self.loading = true;
				PlusApi.getList(Params, true)
					.then(data => {
						self.loading = false;
						self.selectAll = false;
						self.tableData = data.data.list.data;
						self.categoryList = data.data.category;
						self.totalDataNumber = data.data.list.total;
						self.product_count = data.data.product_count;
						self.lecturer = data.data.lecturer;
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
			reset() {
				this.curPage = 1;
				this.searchForm = {
					product_name: '',
					category_id: ''
				}
				this.getData();
			},
			agentClick(row) {
				this.productModel = {
					'course_id': row.course_id,
					'title': row.title,
					'is_agent': row.is_agent,
					'is_ind_agent': row.is_ind_agent
				};
				this.open_agent = true;
			},
			/*关闭弹窗*/
			closeDialogFunc(e, f) {
				if (f == 'Agent') {
					this.open_agent = e.openDialog;
					if (e.type == 'success') {
						this.getData();
					}
				}
			},
			allSelection(rows) {
				this.$refs.multipleTable.toggleAllSelection();
			},
			changeAgent(type) {
				let self = this;
				let list = this.checkList;
				if (list.length <= 0) {
					return
				}
				let params = [];
				list.forEach((item, index) => {
					params.push(item.course_id);
				})
				PlusApi.setState({
						courseIds: params.join(','),
						is_agent: type
					}, true)
					.then(res => {
						self.loading = false;
						ElMessage({
							message: res.msg,
							type: 'success'
						});
						self.getData();
					})
					.catch(error => {
						self.loading = false;
					});
			}
		}
	};
</script>

<style></style>