<template>

  <div class="product-list">
    <!--搜索表单-->
    <div class="common-seach-wrap">
      <el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="考试分类">
          <el-select size="small" v-model="searchForm.category_id" placeholder="所有分类">
            <el-option label="全部" value="0"></el-option>
            <el-option v-for="(item, index) in categoryList" :key="index" :label="item.name" :value="item.category_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
        	<el-select size="small" v-model="searchForm.audit_status" placeholder="审核状态">
        		<el-option label="全部" value="0,20"></el-option>
        		<el-option label="待审核" :value="0"></el-option>
        		<el-option label="未通过" :value="20"></el-option>
        	</el-select>
        </el-form-item>
        <el-form-item label="考试名称">
          <el-input size="small" v-model="searchForm.search" placeholder="请输入考试名称"></el-input>
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
		  <el-table-column prop="paper_id" label="ID"></el-table-column>
          <el-table-column prop="title" label="考试名称"></el-table-column>
          <el-table-column prop="image" label="封面">
            <template  #default="scope">
              <div class="product-info">
                <div class="pic"><img v-img-url="scope.row.image.file_path" alt="" /></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="category.name" label="考试分类"></el-table-column>
          <el-table-column prop="item_number" label="题目数量"></el-table-column>
          <el-table-column prop="money" label="价格"></el-table-column>
          <el-table-column prop="is_show" label="状态">
          	<template #default="scope">
          		<span v-if="scope.row.is_show==0">显示</span>
          		<span v-if="scope.row.is_show==1">隐藏</span>
          	</template>
          </el-table-column>
		  <el-table-column prop="status" label="审核状态">
		  	<template #default="scope">
		  		<span v-if="scope.row.audit_status==0">待审核</span>
		  		<span v-else-if="scope.row.status==10">通过</span>
		  		<span v-else><div class="red">未通过</div>{{scope.row.audit_remark}}</span>
		  	</template>
		  </el-table-column>
		  <el-table-column prop="lecturer" label="创建讲师">
		  	<template #default="scope">
		  		<span class="green" v-if="scope.row.lecturer">{{scope.row.lecturer.name}}</span>
		  	</template>
		  </el-table-column>
          <el-table-column prop="sort" label="排序"></el-table-column>
          <el-table-column prop="create_time" label="创建时间"></el-table-column>
          <el-table-column fixed="right" label="操作" width="90">
            <template  #default="scope">
              <el-button v-if="scope.row.audit_status==0" @click="editClick(scope.row)" type="text" size="small" v-auth="'/audit/exam/edit'">
                审核
              </el-button>
              <el-button v-if="scope.row.audit_status!=0" @click="detailClick(scope.row)" type="text" size="small" v-auth="'/audit/exam/edit'">
                详情</el-button>
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
  </div>
</template>

<script>
  import AuditApi from '@/api/audit.js';
  import qs from 'qs';
  export default {
    data() {
      return {
        isPopUp: false,
        paper_id: 0,
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
          search: '',
          category_id: '',
          audit_status: '0,20',
        },
        /*列表数据*/
        tableData: [],
        /*全部分类*/
        categoryList: [],
        /*考试统计*/
        product_count: {}
      };
    },
    created() {
      /*获取列表*/
      this.getData();
    },
    methods: {
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
        Params.page = self.curPage;
        Params.list_rows = self.pageSize;
        self.loading = true;
        AuditApi.examList(Params, true)
          .then(data => {
            self.loading = false;
            self.tableData = data.data.list.data;
            self.categoryList = data.data.category;
            self.totalDataNumber = data.data.list.total;
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
      editClick(row) {
        this.$router.push({
          path: '/audit/exam/edit',
          query: {
            paper_id: row.paper_id,
            scene: 'edit'
          }
        });
      },
	  detailClick(row) {
        this.$router.push({
          path: '/audit/exam/edit',
          query: {
            paper_id: row.paper_id,
            scene: 'detail'
          }
        });
      },
    }
  };
</script>

<style></style>
