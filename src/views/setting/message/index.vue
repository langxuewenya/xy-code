<template>

	<div class="user">
		<!--内容-->
		<div class="product-content">
			<div class="table-wrap">
				<el-table size="small" :data="tableData" border style="width: 100%" v-loading="loading">
					<el-table-column prop="message_type.text" label="所属"></el-table-column>
					<el-table-column prop="message_name" label="通知名称"></el-table-column>
					<el-table-column prop="remark" label="推送规则"></el-table-column>
					<!-- <el-table-column label="公众号通知" v-if="message_to == 10  || message_to == 30">
            <template #default="scope">
              <el-checkbox v-model="scope.row.mp_status" @change="checked=>mpStatusChange(checked, scope.row)">启用</el-checkbox>
              <el-link type="primary" :underline="false" style="padding-left: 10px;" @click="mpClick(scope.row)">设置</el-link>
            </template>
          </el-table-column> -->
					<el-table-column label="小程序通知" v-if="message_to == 10 || message_to == 30">
						<template #default="scope">
							<div class="d-s-c">
								<el-checkbox v-model="scope.row.wx_status"
									@change="checked=>wxStatusChange(checked, scope.row)">启用</el-checkbox>
								<el-link type="primary" :underline="false" style="padding-left: 10px;"
									@click="wxClick(scope.row)">设置</el-link>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>

		<!--公众号-->
		<Mp v-if="open_mp" :open_mp="open_mp" :messageModel="messageModel" @closeDialog="closeDialogFunc($event, 'mp')">
		</Mp>
		<!--小程序-->
		<Wx v-if="open_wx" :open_wx="open_wx" :messageModel="messageModel" @closeDialog="closeDialogFunc($event, 'wx')">
		</Wx>
	</div>
</template>

<script>
	import MessageApi from '@/api/message.js';
	import Mp from './settings/Mp.vue';
	import Wx from './settings/Wx.vue';

	export default {
		components: {
			Mp,
			Wx,
		},
		data() {
			return {
				/*是否加载完成*/
				loading: true,
				/*列表数据*/
				tableData: [],
				/*是否打开添加弹窗*/
				open_mp: false,
				open_wx: false,
				open_sms: false,
				/*当前编辑的对象*/
				messageModel: {},
				/*参数*/
				message_to: 10,
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
				MessageApi.messageList({
						message_to: self.message_to
					}, true)
					.then(data => {
						self.loading = false;
						self.tableData = data.data.list;
						self.tableData.forEach(function(message) {
							message.mp_status = message.mp_status === 1 ? true : false;
							message.wx_status = message.wx_status === 1 ? true : false;
							if (message.message_settings_id == null) {
								message.message_settings_id = 0;
							}
						});
					})
					.catch(error => {

					});
			},
			/*公众号消息模板设置*/
			mpClick(item) {
				this.messageModel = item;
				this.open_mp = true;
			},
			/*微信小程序消息模板设置*/
			wxClick(item) {
				this.messageModel = item;
				this.open_wx = true;
			},
			/*关闭弹窗*/
			closeDialogFunc(e, f) {
				if (f == 'mp') {
					this.open_mp = e.openDialog;
					if (e.type == 'success') {
						this.getData();
					}
				}
				if (f == 'wx') {
					this.open_wx = e.openDialog;
					if (e.type == 'success') {
						this.getData();
					}
				}
			},
			mpStatusChange: function(checked, row) {
				let self = this;

				if (row.message_settings_id == 0 || row['mp_template'] == null) {
					self.$alert('请先点击右边设置，设置模板规则', '提示', {
						confirmButtonText: '确定'
					});
					row.mp_status = false;
					return;
				}
				self.loading = true;
				MessageApi.updateSettingsStatus({
						message_type: 'mp',
						message_settings_id: row.message_settings_id
					}, true)
					.then(data => {
						self.loading = false;
						row.mp_status = checked;
					})
					.catch(error => {
						self.loading = false;
						row.mp_status = !checked;
					});
			},
			wxStatusChange: function(checked, row) {
				let self = this;

				if (row.message_settings_id == 0 || row['wx_template'] == null) {
					self.$alert('请先点击右边设置，设置模板规则', '提示', {
						confirmButtonText: '确定'
					});
					row.wx_status = false;
					return;
				}
				self.loading = true;
				MessageApi.updateSettingsStatus({
						message_type: 'wx',
						message_settings_id: row.message_settings_id
					}, true)
					.then(data => {
						self.loading = false;
						row.wx_status = checked;
					})
					.catch(error => {
						self.loading = false;
						row.wx_status = !checked;
					});
			},
		}
	};
</script>

<style>
	.operation-wrap {
		border-radius: 8px;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
		padding: 15px 15px;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-direction: column;
		flex-direction: column;
		overflow: hidden;
		background: #909399;
		background-size: 100% 100%;
		color: #fff;
		margin-bottom: 10px;
	}
</style>