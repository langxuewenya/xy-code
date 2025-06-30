import request from '@/utils/request'
let OrderApi = {
    /*订单列表*/
    orderlist(data, errorback) {
        return request._post('/shop/order.order/index', data, errorback);
    },
    /*订单详情*/
    orderdetail(data, errorback) {
        return request._post('/shop/order.order/detail', data, errorback);
    }
}

export default OrderApi;
