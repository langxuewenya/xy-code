import request from '@/utils/request'

let ExchangeApi = {
  /*活动列表*/
  exchangelist(data, errorback) {
    return request._post('/shop/plus.exchange.exchange/index', data, errorback);
  },
  /*添加活动*/
  toAddExchange(data, errorback) {
    return request._get('/shop/plus.exchange.exchange/add', data, errorback);
  },
  /*添加活动*/
  addExchange(data, errorback) {
    return request._post('/shop/plus.exchange.exchange/add', data, errorback);
  },
  /*活动详情*/
  toEditExchange(data, errorback) {
    return request._get('/shop/plus.exchange.exchange/edit', data, errorback);
  },
  /*编辑活动*/
  editExchange(data, errorback) {
    return request._post('/shop/plus.exchange.exchange/edit', data, errorback);
  },
  /*生成码详情*/
  toCodeExchange(data, errorback) {
    return request._get('/shop/plus.exchange.exchange/code', data, errorback);
  },
  /*生成码*/
  codeExchange(data, errorback) {
    return request._post('/shop/plus.exchange.exchange/code', data, errorback);
  },
  /*删除活动*/
  deleteExchange(data, errorback) {
    return request._post('/shop/plus.exchange.exchange/delete', data, errorback);
  },
  /*删除活动*/
  setExchange(data, errorback) {
    return request._post('/shop/plus.exchange.exchange/set', data, errorback);
  },
  codelist(data, errorback) {
    return request._post('/shop/plus.exchange.code/index', data, errorback);
  },
  /*兑换码详情*/
  toEditCode(data, errorback) {
    return request._get('/shop/plus.exchange.code/edit', data, errorback);
  },
  /*编辑兑换码*/
  editCode(data, errorback) {
    return request._post('/shop/plus.exchange.code/edit', data, errorback);
  },
}
export default ExchangeApi;
