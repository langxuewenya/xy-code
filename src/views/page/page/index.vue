<template>

  <div class="user">
    <!--添加页面-->
    <div class="common-level-rail">
      <el-button size="small" type="primary" icon="Plus" @click="addClick()" v-auth="'/page/page/add'">添加页面</el-button>
    </div>

    <!--内容-->
    <div class="product-content">
      <div class="table-wrap">
        <el-table size="small" :data="tableData" border style="width: 100%" v-loading="loading">
          <el-table-column prop="page_id" label="页面ID" width="80"></el-table-column>
          <el-table-column prop="page_name" label="页面名称">
            <template  #default="scope">
              <span>{{ scope.row.page_name }}</span>
              <!-- <span class="gray">（首页）</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="page_type" label="页面类型">
            <template  #default="scope">
              <span v-if="scope.row.page_type==10">商城首页</span>
              <span v-if="scope.row.page_type==20">自定义页</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="添加时间"></el-table-column>
          <el-table-column prop="update_time" label="更新时间"></el-table-column>
          <el-table-column fixed="right" label="操作" width="90">
            <template  #default="scope">
              <el-button @click="editClick(scope.row.page_id)" type="text" size="small" v-auth="'/page/page/edit'">编辑</el-button>
              <el-button v-if="scope.row.page_type==20" @click="deleteClick(scope.row.page_id)" type="text" size="small" v-auth="'/page/page/delete'">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--分页-->
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page="curPage"
          :page-size="pageSize" layout="total, prev, pager, next, jumper"
          :total="totalDataNumber">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
  import PageApi from '@/api/page.js';
  export default {
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
        let Params = {};
        Params.page = self.curPage;
        Params.list_rows = self.pageSize;
        PageApi.PageList(Params, true).then(data => {
          self.loading = false;
          self.tableData = data.data.list.data;
          self.totalDataNumber = data.data.list.total;
        }).catch(error => {

        });
      },

      /*删除数据*/
      deleteClick(row) {
        let self = this;
        ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.loading = true;
          PageApi.deletePage({
              page_id: row
            }, true).then(data => {
              if (data.code == 1) {
                self.loading = false;
                ElMessage({
                  message: '恭喜你，删除成功',
                  type: 'success'
                });
                self.getTableList();
              } else {
                self.loading = false;
              }
            })
            .catch(error => {
              self.loading = false;
            });

        }).catch(() => {});
      },

      /*添加页面*/
      addClick() {
        this.$router.push('/page/page/add');
      },

      /*设为首页*/
      setHomeClick(page_id) {
        let self = this;
        ElMessageBox.confirm('确定要将此页面设置为默认首页吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.loading = true;
          PageApi.setHome({
              page_id: page_id
            }, true).then(data => {
              self.loading = false;
              if (data.code == 1) {
                ElMessage({
                  message: '恭喜你，设置成功',
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
      },

      /*编辑*/
      editClick(page_id) {
        let self = this;
        self.$router.push({
          path: '/page/page/edit',
          query: {
            page_id: page_id
          }
        })

      }
    }
  };
</script>
<style></style>
