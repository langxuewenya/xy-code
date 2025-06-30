<template>
  <div class="product-add" v-loading="loading">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="基础设置" name="basic"></el-tab-pane>
      <el-tab-pane label="试题选择" name="question"></el-tab-pane>
    </el-tabs>
    <!--form表单-->
    <el-form size="small" ref="form" :model="form" label-width="180px" v-if="!loading">
      <!--基础信息-->
      <Basic v-show="activeName == 'basic'"></Basic>
      <!--题库-->
      <QuestionIndex v-show="activeName == 'question'"></QuestionIndex>
      <!--审核-->
      <div class="common-button-wrapper" style="height: 50px">
        <el-button size="small" type="info" @click="cancelFunc">取消</el-button>
        <el-button size="small" v-if="form.model.audit_status==0" type="primary" @click="onSubmit('edit')" :disabled="save_loading">发布
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import AuditApi from '@/api/audit.js';
  import Basic from './part/Basic.vue';
  import QuestionIndex from './part/Question.vue';
  export default {

    components: {
      /*基础信息*/
      Basic,
      /*商品详情*/
      QuestionIndex,
    },
    data() {

      return {
        save_loading: false,
        activeName: 'basic',
        /*是否正在加载*/
        loading: false,
        paper_id: 0,
        scene: 'edit',
        /*form表单数据*/
        form: {
          model: {
            paper_paper_id: 0,
              title: '',
              image_id: '',
              item_number: '',
              virtual_answer: '',
              single_number: '',
              single_score: '',
              many_number: '',
              many_score: '',
              judge_number: '',
              judge_score: '',
              difficulty: null,
              sort: 0,
              is_score:0,
              is_show: 0,
              virtual_sales: 0,
              question: [],
              single: [],
              many: [],
              judge: []
            },
            /*商品分类*/
            category: [],
            questionType: [],
            single: [],
            many: [],
            judge: [],
        }
      };
    },
    provide: function() {
      return {
        form: this.form
      };
    },
    created() {
      /*获取列表*/
      this.paper_id = this.$route.query.paper_id;
      this.scene = this.$route.query.scene;
      this.getData();
    },
    methods: {
      /**
       * 获取基础数据
       */
      getData: function() {
        let self = this;
        AuditApi.getTrainDetail({
              paper_id: self.paper_id,
              scene: self.scene
            },
            true
          )
          .then(res => {
            self.loading = false;
            Object.assign(self.form, res.data);
            let single = {};
            if (self.form.model.single.length > 0) {
              self.form.model.single.forEach((item, index) => {
                single = {
                  question_id: item.question_id,
                  category: {
                    name: item.question.category.name
                  },
                  type_name: item.question.type_name,
                  title: item.question.title,
                  sort: item.question.sort,
                  question_type:item.question_type,
                  paper_question_id:item.paper_question_id,
                  paper_id:item.paper_id
                }
                self.form.single.push(single)
              })
            }
            let many = {};
            if (self.form.model.many.length > 0) {
              self.form.model.many.forEach((item, index) => {
                many = {
                  question_id: item.question_id,
                  category: {
                    name: item.question.category.name
                  },
                  type_name: item.question.type_name,
                  title: item.question.title,
                  sort: item.question.sort,
                  question_type:item.question_type,
                  paper_question_id:item.paper_question_id,
                  paper_id:item.paper_id
                }
                self.form.many.push(many)
              })
            }
            let judge = {};
            if (self.form.model.judge.length > 0) {
              self.form.model.judge.forEach((item, index) => {
                judge = {
                  question_id: item.question_id,
                  category: {
                    name: item.question.category.name
                  },
                  type_name: item.question.type_name,
                  title: item.question.title,
                  sort: item.question.sort,
                  question_type:item.question_type,
                  paper_question_id:item.paper_question_id,
                  paper_id:item.paper_id
                }
                self.form.judge.push(judge)
              })
            }

            self.form.model.single = self.form.single;
            self.form.model.many = self.form.many;
            self.form.model.judge = self.form.judge;
			if (self.form.model.audit_status != 0) {
				self.form.audit_status = self.form.model.audit_status;
				self.form.audit_remark = self.form.model.audit_remark;
			} else {
				self.form.audit_status = 10;
			}
          })
          .catch(error => {
            self.loading = false;
          });
      },

      /*提交*/
      onSubmit: function(submit_type) {
        let self = this;
        self.$refs.form.validate(valid => {
          if (valid) {
            let params = {};
            params.paper_id = self.paper_id;
            params.audit_status = self.form.audit_status;
            params.audit_remark = self.form.audit_remark;
            self.save_loading = true;
            AuditApi.editTrain(params, true)
              .then(data => {
                self.save_loading = false;
                ElMessage({
                  message: '保存成功',
                  type: 'success'
                });
                self.cancelFunc();
              })
              .catch(error => {
                self.save_loading = false;
              });
          } else {
            ElMessage({
              message: '请检查必填项是否填写完整',
              type: 'error'
            });
          }
        });
      },

      /*取消*/
      cancelFunc() {
        this.$router.back(-1);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .basic-setting-content {}

  .product-add {
    padding-bottom: 50px;
  }

  .mb50 {
    margin-bottom: 50px;
  }
</style>
