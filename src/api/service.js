import request from '@/utils/request'

let ServiceApi = {
  /*消息列表*/
  servicelist(data, errorback) {
    return request._post('/shop/service.service/index', data, errorback);
  },
  /*获取消息分类*/
  getCategory(data, errorback) {
    return request._post('/shop/service.category/index', data, errorback);
  },
  /*添加消息*/
  toAddService(data, errorback) {
    return request._get('/shop/service.service/add', data, errorback);
  },
  /*添加消息*/
  addService(data, errorback) {
    return request._post('/shop/service.service/add', data, errorback);
  },
  /*消息详情*/
  toEditService(data, errorback) {
    return request._get('/shop/service.service/edit', data, errorback);
  },
  /*编辑消息*/
  editService(data, errorback) {
    return request._post('/shop/service.service/edit', data, errorback);
  },
  /*删除消息*/
  deleteService(data, errorback) {
    return request._post('/shop/service.service/delete', data, errorback);
  },
  /*添加分类*/
  addCategory(data, errorback) {
    return request._post('/shop/service.category/add', data, errorback);
  },
  /*编辑分类*/
  editCategory(data, errorback) {
    return request._post('/shop/service.category/edit', data, errorback);
  },
  /*删除分类*/
  deleteCategory(data, errorback) {
    return request._post('/shop/service.category/delete', data, errorback);
  },
}
export default ServiceApi;
