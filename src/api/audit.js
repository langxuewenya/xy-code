import request from '@/utils/request'

let AuditApi = {
	/*课程审核列表*/
	courseList(data, errorback) {
		return request._post('/shop/audit.course/index', data, errorback);
	},
	/*课程审核详情*/
	getCourseDetail(data, errorback) {
		return request._get('/shop/audit.course/edit', data, errorback);
	},
	/*课程审核*/
	editCourse(data, errorback) {
		return request._post('/shop/audit.course/edit', data, errorback);
	},
	/*课程课时列表*/
	courseSectionList(data, errorback) {
		return request._post('/shop/audit.course/section', data, errorback);
	},
	/*课程课时详情*/
	courseSectionDetail(data, errorback) {
		return request._post('/shop/audit.course/sectionDetail', data, errorback);
	},
	/*教务审核列表*/
	educationList(data, errorback) {
		return request._post('/shop/audit.education/index', data, errorback);
	},
	/*教务审核详情*/
	getEducationDetail(data, errorback) {
		return request._get('/shop/audit.education/edit', data, errorback);
	},
	/*教务审核*/
	editEducation(data, errorback) {
		return request._post('/shop/audit.education/edit', data, errorback);
	},
	/*教务课时列表*/
	educationSectionList(data, errorback) {
		return request._post('/shop/audit.education/section', data, errorback);
	},
	/*教务课时详情*/
	educationSectionDetail(data, errorback) {
		return request._post('/shop/audit.education/sectionDetail', data, errorback);
	},
	/*考试审核列表*/
	examList(data, errorback) {
		return request._post('/shop/audit.exam/index', data, errorback);
	},
	/*考试审核详情*/
	getExamDetail(data, errorback) {
		return request._get('/shop/audit.exam/edit', data, errorback);
	},
	/*考试审核*/
	editExam(data, errorback) {
		return request._post('/shop/audit.exam/edit', data, errorback);
	},
	/*练习审核列表*/
	trainList(data, errorback) {
		return request._post('/shop/audit.train/index', data, errorback);
	},
	/*练习审核详情*/
	getTrainDetail(data, errorback) {
		return request._get('/shop/audit.train/edit', data, errorback);
	},
	/*练习审核*/
	editTrain(data, errorback) {
		return request._post('/shop/audit.train/edit', data, errorback);
	},

}

export default AuditApi;