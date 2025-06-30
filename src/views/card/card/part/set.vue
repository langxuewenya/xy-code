<template>

  <div class="basic-setting-content pl16 pr16">
    <el-form-item label="有效期：" :rules="[{ required: true, message: '请填写有效期' }]" prop="model.expire">
      <el-input v-model="form.model.expire" class="max-w460" type="number"></el-input>
      <div class="gray9">有效期限（天），0为永久有效</div>
    </el-form-item>
	<el-form-item label="原价：" :rules="[{ required: true, message: '请填写原价' }]" prop="model.line_money">
	  <el-input v-model="form.model.line_money" class="max-w460" type="number"></el-input>
	  <div class="gray9">用户购买会员卡需要支付的金额，0为用户免费领取</div>
	</el-form-item>
    <el-form-item label="销售价格：" :rules="[{ required: true, message: '请填写价格' }]" prop="model.money">
      <el-input v-model="form.model.money" class="max-w460" type="number"></el-input>
      <div class="gray9">用户购买会员卡需要支付的金额，0为用户免费领取</div>
    </el-form-item>
    <el-form-item label="状态：">
      <el-radio-group v-model="form.model.status">
        <el-radio :value="0">关闭</el-radio>
        <el-radio :value="1">启用</el-radio>
      </el-radio-group>
    </el-form-item>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    created() {

    },
    inject: ['form'],
    methods: {

    }
  };
</script>

<style></style>
