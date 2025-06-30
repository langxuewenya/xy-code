import request from '@/utils/request'

let ChatApi = {
	/*客服列表*/
	chatIndex(data, errorback) {
		return request._post('/shop/chat.chat/index', data, errorback);
	},
	/*添加客服*/
	chatAdd(data, errorback) {
		return request._post('/shop/chat.chat/add', data, errorback);
	},
	/*客服详情*/
	tochatedit(data, errorback) {
		return request._get('/shop/chat.chat/edit', data, errorback);
	},
	/*编辑客服*/
	chatedit(data, errorback) {
		return request._post('/shop/chat.chat/edit', data, errorback);
	},
	/*删除客服*/
	chatdelete(data, errorback) {
		return request._get('/shop/chat.chat/delete', data, errorback);
	},
	/*聊天记录*/
	chatList(data, errorback) {
		return request._post('/shop/chat.chat/list', data, errorback);
	},
	/*对话记录*/
	chatRecord(data, errorback) {
		return request._post('/shop/chat.chat/record', data, errorback);
	},
	/*工作台*/
	workbench(data, errorback) {
		return request._post('/shop/chat.chat/workbench', data, errorback);
	},
	/*设置客服状态*/
	editStatus(data, errorback) {
		return request._post('/shop/chat.chat/set', data, errorback);
	},
}

export default ChatApi;