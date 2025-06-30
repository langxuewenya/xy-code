import request from '@/utils/request'

let PaperApi = {
  /*试题列表*/
  examPaperList(data, errorback) {
    return request._post('/shop/paper.exam.paper/index', data, errorback);
  },
   /*考试记录*/
  examRecordList(data, errorback) {
    return request._post('/shop/paper.exam.record/index', data, errorback);
  },
  /*查看答题*/
  examRecordQuestion(data, errorback) {
    return request._post('/shop/paper.exam.record/question', data, errorback);
  },
  /*提型*/
  getexamPaper(data, errorback) {
    return request._get('/shop/paper.exam.paper/add', data, errorback);
  },
  /*添加考试*/
  addexamPaper(data, errorback) {
    return request._post('/shop/paper.exam.paper/add', data, errorback);
  },
  getEditexamPaper(data, errorback) {
    return request._get('/shop/paper.exam.paper/edit', data, errorback);
  },
  editexamPaper(data, errorback) {
    return request._post('/shop/paper.exam.paper/edit', data, errorback);
  },
  delexamPaper(data, errorback) {
    return request._post('/shop/paper.exam.paper/delete', data, errorback);
  },
  stateexamPaper(data, errorback) {
    return request._post('/shop/paper.exam.paper/state', data, errorback);
  },
  /*分类管理*/
  examcatList(data, errorback) {
    return request._post('/shop/paper.exam.category/index', data, errorback);
  },
  /*分类添加*/
  examcatAdd(data, errorback) {
    return request._post('/shop/paper.exam.category/add', data, errorback);
  },
  /*分类删除*/
  examcatDel(data, errorback) {
    return request._post('/shop/paper.exam.category/delete', data, errorback);
  },
  /*分类修改*/
  examcatEdit(data, errorback) {
    return request._post('/shop/paper.exam.category/edit', data, errorback);
  },
  /*分类状态*/
  examcatSet(data, errorback) {
    return request._post('/shop/paper.exam.category/set', data, errorback);
  },
  /* ------------- 练习 ----------------------*/
  /*试题列表*/
  trainPaperList(data, errorback) {
    return request._post('/shop/paper.train.paper/index', data, errorback);
  },
   /*考试记录*/
  trainRecordQuestion(data, errorback) {
    return request._post('/shop/paper.train.record/question', data, errorback);
  },
  /*查看答题*/
  trainRecordList(data, errorback) {
    return request._post('/shop/paper.train.record/index', data, errorback);
  },
  /*提型*/
  gettrainPaper(data, errorback) {
    return request._get('/shop/paper.train.paper/add', data, errorback);
  },
  /*添加考试*/
  addtrainPaper(data, errorback) {
    return request._post('/shop/paper.train.paper/add', data, errorback);
  },
  getEdittrainPaper(data, errorback) {
    return request._get('/shop/paper.train.paper/edit', data, errorback);
  },
  edittrainPaper(data, errorback) {
    return request._post('/shop/paper.train.paper/edit', data, errorback);
  },
  deltrainPaper(data, errorback) {
    return request._post('/shop/paper.train.paper/delete', data, errorback);
  },
  statetrainPaper(data, errorback) {
    return request._post('/shop/paper.train.paper/state', data, errorback);
  },
  /*分类管理*/
  traincatList(data, errorback) {
    return request._post('/shop/paper.train.category/index', data, errorback);
  },
  /*分类添加*/
  traincatAdd(data, errorback) {
    return request._post('/shop/paper.train.category/add', data, errorback);
  },
  /*分类删除*/
  traincatDel(data, errorback) {
    return request._post('/shop/paper.train.category/delete', data, errorback);
  },
  /*分类修改*/
  traincatEdit(data, errorback) {
    return request._post('/shop/paper.train.category/edit', data, errorback);
  },
  /*分类状态*/
  traincatSet(data, errorback) {
    return request._post('/shop/paper.train.category/set', data, errorback);
  },
}

export default PaperApi;
