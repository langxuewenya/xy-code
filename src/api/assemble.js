import request from '@/utils/request'

let AssembleApi = {
  /*拼团列表*/
  assembleList(data, errorback) {
    return request._post('/shop/plus.assemble.assemble/index', data, errorback);
  },
  /*详情*/
  assembleDetail(data, errorback) {
    return request._post('/shop/plus.assemble.assemble/detail', data, errorback);
  },
  /*获取拼团设置*/
  getSetting(data, errorback) {
    return request._get('/shop/plus.assemble.setting/index', data, errorback);
  },
  /*保存拼团设置*/
  saveSetting(data, errorback) {
    return request._post('/shop/plus.assemble.setting/index', data, errorback);
  },
}
export default AssembleApi;
