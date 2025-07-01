<template>

  <el-dialog title="编辑" v-model="dialogVisible" @close="dialogFormVisible" :close-on-click-modal="false"
    :close-on-press-escape="false" width="70%">
    <div class="edit-dialog">
      <div class="edit-form">
        <!-- 编辑部分 -->
        <div class="edit-title"><b>添加表单字段</b></div>
        <el-form size="small" :model="form" :rules="formRules" ref="form">
          <el-form-item label="字段类型" prop="newField.type" :label-width="formLabelWidth">
            <el-select v-model="form.newField.type" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="字段标签" prop="newField.label" :label-width="formLabelWidth">
            <el-input v-model="form.newField.label" autocomplete="off" placeholder="请输入字段标签"></el-input>
          </el-form-item>
          <div v-if="form.newField.type === 'radio' || form.newField.type === 'checkbox'" >
            <el-form-item label="选项设置" prop="options" :label-width="formLabelWidth">
              <div v-for="(option, index) in form.newField.options" :key="index" class="option-item">
                <el-input
                  v-model="form.newField.options[index]"
                  type="text"
                  placeholder="选项文本"
                  class="option-input"
                />
                <el-button @click="removeOption(index)" type="danger">删除</el-button>
              </div>
              <el-button @click="addOption(index)">添加选项</el-button>
            </el-form-item>
            <div v-if="form.newField.type === 'radio'">
              <el-form-item label="是否联动" :label-width="formLabelWidth">
                <el-checkbox v-model="form.newField.hasLinkedField">启用</el-checkbox>
              </el-form-item>
              <div v-if="form.newField.hasLinkedField">
                <el-form-item label="联动字段标签" prop="newField.linkedField.label" :label-width="formLabelWidth">
                  <el-input v-model="form.newField.linkedField.label" autocomplete="off" placeholder="请输入联动字段标签"></el-input>
                </el-form-item>
                <el-form-item label="关联选项" prop="newField.linkedField.optionIndex" :label-width="formLabelWidth">
                  <el-select v-model="form.newField.linkedField.optionIndex" placeholder="请选择">
                    <el-option v-for="(item, index) in form.newField.options" :key="index" :label="item" :value="index"/>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
          <el-button @click="addField" class="add-field-btn">添加字段</el-button>
          <!-- <el-form-item label="字段类型" prop="data_excel" :label-width="formLabelWidth">
              <el-input v-model="form.data_excel" autocomplete="off"></el-input>
            </el-form-item> -->
          <div >
          </div>
        </el-form>
      </div>
      <!-- 表单预览 -->
      <div class="preview-form">
        <div class="preview-title"><b>表单预览</b></div>
        <el-form size="small" :model="form" ref="form">
          <el-form-item v-for="field in formFields" :key="field.id" :label="field.label" :label-width="'formLabelWidth'">
            <!-- 文本框类型 -->
            <el-input v-if="field.type === 'text'" v-model="formValues[field.id]" :placeholder="`请输入${field.label}`"></el-input>
            <!-- 单选框类型 -->
            <div v-if="field.type === 'radio'">
              <el-radio-group v-for="(option, optIndex) in field.options" v-model="formValues[field.id]">
                <el-radio :value="option" @change="handleRadioChange(field, optIndex)" style="margin-right: 20px;">{{ option }}</el-radio>
              </el-radio-group>
            </div>
            <!-- 联动字段 -->
            <div
              v-if="
                field.hasLinkedField &&
                field.linkedField.optionIndex === selectedRadioOptions[field.id]
              "
            >
              <el-form-item :label="field.linkedField.label" style="margin-left: -30px;">
                <el-input
                  :id="'linked-field-' + index"
                  v-model="formValues[field.linkedField.id]"
                  type="text"
                  :placeholder="'请输入' + field.linkedField.label"
                />
              </el-form-item>
            </div>
            <!-- 多选框类型 -->
            <div v-if="field.type === 'checkbox'">
              <el-checkbox-group v-for="(option, optIndex) in field.options" v-model="formValues[field.id]">
                <el-checkbox :value="option">{{ option }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible">取 消</el-button>
        <el-button type="primary" @click="addUser" :loading="loading">提 交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  import { v4 as uuid } from "uuid";
  import CourseApi from '@/api/course.js';
  import EnrollApi from "../../../api/enroll";
  export default {
    data() {
      return {
        form: {
          newField: {
            type: "text",
            label: "",
            options: ["选项1", "选项2"],
            hasLinkedField: false,
            linkedField: {
              id: "",
              label: "",
              optionIndex: 0
            },
            id: ""
          }
        },
        // 字段类型选项
        options: [
          {
            value: 'text',
            label: '文本框'
          },
          {
            value: 'radio',
            label: '单选框'
          },
          {
            value: 'checkbox',
            label: '多选框'
          }
        ],
        formRules: {
          'newField.type': [{
            required: true,
            message: '请选择字段类型',
            trigger: 'blur'
          }],
          'newField.label': [{
            required: true,
            message: '请输入字段标签',
            trigger: 'blur'
          }],
          'newField.linkedField.label': [{
            required: true,
            message: '请输入联动字段标签',
            trigger: 'blur'
          }],
          'newField.linkedField.optionIndex': [{
            required: true,
            message: '请选择关联选项',
            trigger: 'blur'
          }]
        },
        // 表单值
        formValues: {},
        formFields: [],
        // 单选框选中状态
        selectedRadioOptions: {},
        /*左边长度*/
        formLabelWidth: '100px',
        /*是否显示*/
        dialogVisible: false,
        loading: false,
      };
    },
    props: ['open_edit', 'editform'],
    created() {
      this.dialogVisible = this.open_edit;
      this.form.id = this.editform.model.id;
      this.form.title = this.editform.model.title;
      this.form.data_excel  = this.editform.model.data_excel;
      this.form.stime  = this.editform.model.stime;
      this.form.etime  = this.editform.model.etime;
      this.formFields = this.editform.model.data_excel || [];
    },
    methods: {
      // 添加字段
      addField() {
        let self = this;
        let params = self.form;
        self.$refs.form.validate((valid) => {
          if (valid) {
            // self.loading = true;
            console.log(params);
            console.log(params.newField);
            if (!params.newField.label) {
              // alert("请输入字段标签");
              ElMessage({
                message: '请输入字段标签',
                type: 'error'
              });
              return;
            }
            if (
              (params.newField.type === "radio" || params.newField.type === "checkbox") &&
              params.newField.options.length === 0
            ) {
              ElMessage({
                message: '单选/多选类型至少需要一个选项',
                type: 'warning'
              });
              return;
            }
            // 生成唯一ID
            const fieldId = "field_" + uuid();

            // 复制新字段数据
            const fieldData = JSON.parse(JSON.stringify(this.form.newField));
            fieldData.id = fieldId;

            // 处理联动字段
            if (fieldData.type === "radio" && fieldData.hasLinkedField) {
              fieldData.linkedField.id = "linked_" + uuid();
            }

            // 添加到表单字段
            console.log('fieldData', this.formFields);
            this.formFields.push(fieldData);

            // 初始化表单值
            if (fieldData.type === "checkbox") {
              this.formValues[fieldId] = [];
            } else {
              this.formValues[fieldId] = "";
            }

            // 如果有联动字段，也初始化
            if (fieldData.type === "radio" && fieldData.hasLinkedField) {
              this.formValues[fieldData.linkedField.id] = "";
            }

            // 重置新字段
            this.resetNewField();
            console.log('formValues', this.formValues);
            console.log('formFields', this.formFields);

            // CourseApi.catEdit(params, true).then(data => {
            //   self.loading = false;
            //   ElMessage({
            //     message: '修改成功',
            //     type: 'success'
            //   });
            //   self.dialogFormVisible(true);
            // }).catch(error => {
            //   self.loading = false;
            // });
          } else {
            // 验证不通过，Element 会自动显示错误提示
            console.log('验证不通过');
            return false;
          }
        });
      },
      // 重置新字段
      resetNewField () {
        this.form.newField.type = "text";
        this.form.newField.label = "";
        this.form.newField.options = ["选项1", "选项2"];
        this.form.newField.hasLinkedField = false;
        this.form.newField.linkedField = {
          id: "",
          label: "",
          optionIndex: 0
        };
      },
      // 添加选项
      addOption(index) {
        this.form.newField.options.push("新选项");
      },
      // 处理单选框变更
      handleRadioChange (field, optionIndex) {
        this.selectedRadioOptions[field.id] = optionIndex;
      },
      // 移除选项
      removeOption (index) {
        this.form.newField.options.splice(index, 1);
      },
      /*提交修改*/
      addUser() {
        let self = this;
        // let params = self.form;
        // let params = self.formFields;
        let params = {
          id: this.form.id,
          title: this.form.title,
          stime: new Date(this.form.stime).getTime() / 1000,
          etime: new Date(this.form.etime).getTime() / 1000,
          data_excel: JSON.stringify(self.formFields)
        }
        console.log("formFields:", params);
        EnrollApi.enrollAdd(params).then(data => {
          self.loading = false;
          ElMessage({
            message: '修改成功',
            type: 'success'
          });
          self.dialogFormVisible(true);
          console.log("data:", data);
        }).catch(error => {
          self.loading = false;
        });
        // showResult.value = true;
        // self.$refs.form.validate((valid) => {
        //   if (valid) {
        //     self.loading = true;
        //     CourseApi.catEdit(params, true).then(data => {
        //       self.loading = false;
        //       ElMessage({
        //         message: '修改成功',
        //         type: 'success'
        //       });
        //       self.dialogFormVisible(true);
        //     }).catch(error => {
        //       self.loading = false;
        //     });
        //   }
        // });
      },
      /*关闭弹窗*/
      dialogFormVisible(e) {
        if (e) {
          this.$emit('closeDialog', {
            type: 'success',
            openDialog: false
          })
        } else {
          this.$emit('closeDialog', {
            type: 'error',
            openDialog: false
          })
        }
      }

    }
  };
</script>

<style>
  .edit-dialog {
    display: flex;
  }
  .edit-form {
    width: calc(50% + 15px);
    border-right: solid 1px #e6e6e6;
    padding-right: 15px;
  }
  .preview-form {
    flex: 1;
    margin-left: 10px;
  }
  .edit-title, .preview-title {
    text-align: center;
    margin-bottom: 10px;
    margin-top: -10px;
  }
  .add-field-btn {
    display: block;
    margin: 0 auto;
  }
  .option-item {
    display: flex;
    margin-bottom: 8px;
    .option-input {
      margin-right: 5px;
    }
  }
</style>
