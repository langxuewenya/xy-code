import request from '@/utils/request'

let CardApi = {
  /*会员卡列表*/
  cardlist(data, errorback) {
    return request._post('/shop/card.card/index', data, errorback);
  },
  /*添加会员卡*/
  getBaseData(data, errorback) {
    return request._get('/shop/card.card/add', data, errorback);
  },
  /*添加会员卡*/
  addcard(data, errorback) {
    return request._post('/shop/card.card/add', data, errorback);
  },
  /*修改会员卡*/
  getEditData(data, errorback) {
    return request._get('/shop/card.card/edit', data, errorback);
  },
  /*修改会员卡*/
  editcard(data, errorback) {
    return request._post('/shop/card.card/edit', data, errorback);
  },
  /*删除会员卡*/
  deletecard(data, errorback) {
    return request._post('/shop/card.card/delete', data, errorback);
  },
  /*会员卡领取列表*/
  recordlist(data, errorback) {
    return request._post('/shop/card.card/record', data, errorback);
  },
  /*发卡*/
  putcard(data, errorback) {
    return request._post('/shop/card.card/put', data, errorback);
  },
  /*会员卡权益列表*/
  equitylist(data, errorback) {
    return request._post('/shop/card.equity/index', data, errorback);
  },
  /*添加会员卡权益*/
  addequity(data, errorback) {
    return request._post('/shop/card.equity/add', data, errorback);
  },
  /*会员卡权益详情*/
  equityDetail(data, errorback) {
    return request._get('/shop/card.equity/edit', data, errorback);
  },
  /*编辑会员卡权益*/
  editequity(data, errorback) {
    return request._post('/shop/card.equity/edit', data, errorback);
  },
  /*删除会员卡权益*/
  deleteEquity(data, errorback) {
    return request._post('/shop/card.equity/delete', data, errorback);
  },
  /*会员卡说明*/
  toSettingCard(data, errorback) {
    return request._get('/shop/card.card/setting', data, errorback);
  },
  /*会员卡说明*/
  settingCard(data, errorback) {
    return request._post('/shop/card.card/setting', data, errorback);
  },
}

export default CardApi;
