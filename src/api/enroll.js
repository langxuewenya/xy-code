import request from '@/utils/request'

let EnrollApi = {
	/* ------------------------报名----------------------- */
	/*报名列表*/
	enrollList(data, errorback) {
		return request._post('/shop/user.user/Getenrolllist', data, errorback);
	},
	/*创建/编辑报名*/
	enrollAdd(data, errorback) {
		return request._post('/shop/user.user/submitregistration', data, errorback);
	},
    /*修改状态*/
	statusChange (data, errorback) {
		return request._post('/shop/user.user/statuschange', data, errorback);
	},
}

export default EnrollApi;