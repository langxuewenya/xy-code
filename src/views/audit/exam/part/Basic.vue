<template>
	<div>
		<el-form-item label="试卷名称：" :rules="[{ required: true, message: '请填写题干' }]" prop="model.title">
			<el-input v-model="form.model.title" class="max-w460"></el-input>
		</el-form-item>
		<el-form-item label="分类：" :rules="[{ required: true, message: '请选择分类' }]" prop="model.category_id">
			<el-select v-model="form.model.category_id">
				<template v-for="cat in form.category" :key="cat.category_id">
					<el-option :value="cat.category_id" :label="cat.name"></el-option>
				</template>
			</el-select>
		</el-form-item>
		<el-form-item label="考试封面：" :rules="[{ required: true, message: '请上传考试封面' }]" prop="model.image_id">
			<el-row>
				<div class="draggable-list">
					<div class="item img-select" v-if="form.model.image_id == 0"
						@click="openProductUpload('image', 'image')">
						<el-icon>
							<Plus></Plus>
						</el-icon>
					</div>
					<div v-if="form.model.image_id != 0" class="item" @click="openProductUpload('image', 'image')"><img
							:src="form.model.image.file_path" width="100" height="100" /></div>
				</div>
				<div class="tips red">尺寸：630*440</div>
			</el-row>
		</el-form-item>
		<div class="d-s-c mb20">
			<el-form-item label="单选题数量：" :rules="[{ required: true, message: '单选题数量' }]" prop="model.single_number">
				<el-input type="number" min="0" v-model="form.model.single_number" class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="每题分数：" :rules="[{ required: true, message: '每题分数' }]" prop="model.single_score">
				<el-input type="number" min="0" v-model="form.model.single_score" class="max-w460"></el-input>
			</el-form-item>
		</div>
		<div class="d-s-c mb20">
			<el-form-item label="多选题数量：" :rules="[{ required: true, message: '多选题数量' }]" prop="model.many_number">
				<el-input type="number" min="0" v-model="form.model.many_number" class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="每题分数：" :rules="[{ required: true, message: '每题分数' }]" prop="model.many_score">
				<el-input type="number" min="0" v-model="form.model.many_score" class="max-w460"></el-input>
			</el-form-item>
		</div>
		<div class="d-s-c mb20">
			<el-form-item label="判断题数量：" :rules="[{ required: true, message: '判断题数量' }]" prop="model.judge_number">
				<el-input type="number" min="0" v-model="form.model.judge_number" class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="每题分数：" :rules="[{ required: true, message: '每题分数' }]" prop="model.judge_score">
				<el-input type="number" min="0" v-model="form.model.judge_score" class="max-w460"></el-input>
			</el-form-item>
		</div>
		<div class="d-s-c mb20">
			<el-form-item label="试题总数：" prop="item_number">
				<el-input type="number" disabled v-model="item_number" class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="总分数：" prop="model.total_score">
				<el-input type="number" disabled v-model="total_score" class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="虚拟答题人数：" :rules="[{ required: true, message: '虚拟答题人数' }]" prop="model.virtual_answer">
				<el-input type="number" min="0" v-model="form.model.virtual_answer" class="max-w460"></el-input>
			</el-form-item>
		</div>
		<div class="d-s-c mb20">
			<el-form-item label="时长/分：" :rules="[{ required: true, message: '时长/分' }]" prop="model.exam_time">
				<el-input type="number" min="0" v-model="form.model.exam_time" class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="考试次数：" :rules="[{ required: true, message: '考试次数' }]" prop="model.times">
				<el-input type="number" min="0" v-model="form.model.times" class="max-w460"></el-input>
			</el-form-item>
			<div style="white-space: nowrap;" class="gray9">(0为不限制次数)</div>
		</div>
		<el-form-item label="分数等级：" :rules="[{ required: true, message: '分数等级' }]" prop="model.grade"></el-form-item>
		<div class="d-s-c mb20" v-for="(item,index) in form.model.grade" :key="index">
			<el-form-item label="等级名称：">
				<el-input type="text" v-model="item.name" class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="最小分数：">
				<el-input type="number" min="0" v-model="item.min" class="max-w460"></el-input>
			</el-form-item>
			<el-form-item label="最大分数：">
				<el-input type="number" min="1" v-model="item.max" class="max-w460"></el-input>
			</el-form-item>
			<el-button type="text" @click="deleteOption(index)"
				v-if="form.model.grade.length - 1 == index && index > 0">
				删除选项</el-button>
		</div>
		<el-form-item label="">
			<el-button class="button-new-tag" size="small" @click="showInput">+ 添加一项</el-button>
		</el-form-item>
		<el-form-item label="分数显示:" :rules="[{ required: true, message: '选择分数显示' }]" prop="model.is_score">
			<el-radio-group v-model="form.model.is_score">
				<el-radio :label="0">显示</el-radio>
				<el-radio :label="1">隐藏</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="试卷难度:" :rules="[{ required: true, message: '试题难度' }]" prop="model.difficulty">
			<div class="block d-s-c" style="height: 32px;">
				<el-rate v-model="form.model.difficulty"></el-rate>
			</div>
		</el-form-item>
		<el-form-item label="考试排序：" :rules="[{ required: true, message: '考试排序' }]" prop="model.sort">
			<el-input type="number" min="0" v-model="form.model.sort" class="max-w460"></el-input>
		</el-form-item>
		<el-form-item label="付费类型:" :rules="[{ required: true, message: '选择付费类型' }]" prop="model.pay_type">
			<el-radio-group v-model="form.model.pay_type">
				<el-radio :label="0">免费</el-radio>
				<el-radio :label="1">付费</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item :rules="rules.money" v-if="form.model.pay_type == 1" label="付费金额：" prop="model.money">
			<el-input type="number" min="0.01" v-model="form.model.money" class="max-w460"></el-input>
		</el-form-item>
		<el-form-item label="考试状态:" :rules="[{ required: true, message: '选择考试状态' }]" prop="model.is_show">
			<el-radio-group v-model="form.model.is_show">
				<el-radio :label="0">显示</el-radio>
				<el-radio :label="1">隐藏</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="审核状态">
			<el-radio-group v-model="form.audit_status" :disabled="form.model.audit_status!=0">
				<el-radio :label="10">通过</el-radio>
				<el-radio :label="20">未通过</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="审核备注" prop="audit_remark" v-if="form.audit_status==20"
			:rules="[{ required: true, message: '审核备注' }]">
			<el-input type="textarea" v-model="form.audit_remark" class="max-w460"
				:disabled="form.model.audit_status!=0"></el-input>
		</el-form-item>
		<!--课程图片组件-->
		<Upload v-if="isProductUpload" :config="config" :isupload="isProductUpload" @returnImgs="returnProductImgsFunc">
			上传图片
		</Upload>
	</div>
</template>

<script>
	import Upload from '@/components/file/Upload.vue';
	import draggable from 'vuedraggable';
	export default {
		components: {
			Upload,
			draggable
		},
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入金额'));
				} else {
					if (value <= 0) {
						callback(new Error('价格不小于0.01'));
					}
					callback();
				}
			};
			return {
				isProductUpload: false,
				config: {},
				file_name: 'image',
				inputVisible: false,
				inputValue: '',
				rules: {
					money: [{
						validator: validatePass,
						trigger: 'blur'
					}]
				}
			};
		},
		inject: ['form'],
		created() {},
		computed: {
			item_number() {
				let judge_number = this.form.model.judge_number;
				let single_number = this.form.model.single_number;
				let many_number = this.form.model.many_number;
				let item_number = judge_number * 1 + single_number * 1 + many_number * 1;
				this.form.model.item_number = item_number;
				console.log(this.form.model.item_number)
				return item_number
			},
			total_score() {
				let judge_number = this.form.model.judge_number;
				let single_number = this.form.model.single_number;
				let many_number = this.form.model.many_number;
				let judge_score = this.form.model.judge_score;
				let single_score = this.form.model.single_score;
				let many_score = this.form.model.many_score;
				let item_number = judge_number * 1 + single_number * 1 + many_number * 1;
				let total_score = judge_number * judge_score + single_number * single_score + many_number * many_score;
				this.form.model.total_score = total_score;
				console.log(this.form.model.total_score)
				return total_score
			},
		},
		methods: {
			fromCharCode(number) {
				var str = [];
				for (var i = 0; i < 26; i++) {
					str.push(String.fromCharCode(i + 65));
				}
				return str[number];
			},
			/*打开上传图片*/
			openProductUpload: function(file_type, file_name) {
				this.file_name = file_name;
				if (file_type == 'image') {
					this.config = {
						total: 9,
						file_type: 'image'
					};
				}
				this.isProductUpload = true;
			},
			showInput() {
				let self = this;
				this.form.model.grade.push({
					name: '',
					min: '',
					max: ''
				});
			},
			deleteOption(e) {
				this.form.model.grade.splice(e, 1);
			},
			/*上传课程图片*/
			returnProductImgsFunc(e) {
				if (e != null) {
					if (this.file_name == 'image') {
						this.form.model.image_id = e[0].file_id;
						this.form.model.image = e[0];
					}
				}
				this.isProductUpload = false;
			},

			/*删除课程图片*/
			deleteImg(index) {
				this.form.model.banner.splice(index, 1);
			},
			delVideo() {
				this.form.model.video_link = '';
				this.form.model.video_image = '';
			},
			delPdf() {
				this.form.model.pdf_link = '';
				this.form.model.pdf_name = '';
			},
			/*打开添加*/
			setExpress() {
				this.$router.push('/setting/delivery/index');
			},
			changeDelivery(e) {
				if (e == 0) {
					this.form.model.delivery_id = '';
				}
			},
			changeQsType(e) {
				if (e == 1) {
					this.form.model.option_type = 1;
					this.form.model.option = [{
						content: '',
						type: 1
					}, {
						content: '',
						type: 1
					}];
				} else if (e == 2) {
					this.form.model.option_type = 1;
					this.form.model.option = [{
						content: '',
						type: 1
					}, {
						content: '',
						type: 1
					}];
				} else if (e == 3) {
					this.form.model.option_type = 1;
					this.form.model.option = [{
						content: '正确',
						type: 1
					}, {
						content: '错误',
						type: 1
					}];
				}
				this.form.modelanswer = ['A'];
			},
		}
	};
</script>

<style>
	.edit_container {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		line-height: 20px;
		color: #2c3e50;
	}

	.ql-editor {
		height: 400px;
	}

	.draggable-list {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.draggable-list .wrapper>span {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.draggable-list .item {
		position: relative;
		width: 110px;
		height: 110px;
		margin-top: 10px;
		margin-right: 10px;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid #dddddd;
	}

	.draggable-list .delete-btn {
		position: absolute;
		top: 0;
		right: 0;
		width: 16px;
		height: 16px;
		background: red;
		line-height: 16px;
		font-size: 16px;
		color: #ffffff;
		display: none;
	}

	.draggable-list .item:hover .delete-btn {
		display: block;
	}

	.draggable-list .item img {
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		max-height: 100%;
		max-width: 100%;
	}

	.draggable-list .img-select {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px dashed #dddddd;
		font-size: 30px;
	}

	.draggable-list .img-select i {
		color: #409eff;
	}

	.el-tag+.el-tag {
		margin-left: 10px;
	}

	.button-new-tag {
		margin-left: 22px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}

	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}

	.el-input.is-disabled .el-input__inner {
		background-color: #fff;
		border-color: #dcdfe6;
		color: #606266;
		cursor: auto;
	}

	.label-name {
		width: 100px;
	}
</style>