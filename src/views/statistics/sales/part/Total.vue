<template>

	<div class="d-a-c lh30 ww100 pt16">
		<div class="pt30 tc" style="width: 80px;">
			<p class="gray9">总计</p>
			<p class="gray9">今日</p>
			<p class="gray9">昨日</p>
		</div>
		<div class="flex-1 tc">
			<p>成交额</p>
			<p class="f20 fb red">{{dataModel.order.order_total_price.total}}</p>
			<p class="gray3">{{dataModel.order.order_total_price.today}}</p>
			<p class="gray">{{dataModel.order.order_total_price.yesterday}}</p>
		</div>
		<div class="flex-1 tc">
			<p>课程成交额</p>
			<p class="f20 fb red">{{dataModel.order.order_course_total_price.total}}</p>
			<p class="gray3">{{dataModel.order.order_course_total_price.today}}</p>
			<p class="gray">{{dataModel.order.order_course_total_price.yesterday}}</p>
		</div>
		<div class="flex-1 tc">
			<p>教务成交额</p>
			<p class="f20 fb red">{{dataModel.order.order_education_total_price.total}}</p>
			<p class="gray3">{{dataModel.order.order_education_total_price.today}}</p>
			<p class="gray">{{dataModel.order.order_education_total_price.yesterday}}</p>
		</div>
		<div class="flex-1 tc">
			<p>考试成交额</p>
			<p class="f20 fb red">{{dataModel.order.order_paper_total_price.total}}</p>
			<p class="gray3">{{dataModel.order.order_paper_total_price.today}}</p>
			<p class="gray">{{dataModel.order.order_paper_total_price.yesterday}}</p>
		</div>
		<div class="flex-1 tc">
			<p>付款订单</p>
			<p class="f20 fb red">{{dataModel.order.order_total.total}}</p>
			<p class="gray3">{{dataModel.order.order_total.today}}</p>
			<p class="gray">{{dataModel.order.order_total.yesterday}}</p>
		</div>
		<div class="flex-1 tc">
			<p>付款人数</p>
			<p class="f20 fb red">{{dataModel.order.order_user_total.total}}</p>
			<p class="gray3">{{dataModel.order.order_user_total.today}}</p>
			<p class="gray">{{dataModel.order.order_user_total.yesterday}}</p>
		</div>
	</div>
</template>
<script>
	export default {
		components: {},
		data() {
			return {
				/*是否正在加载*/
				loading: true,

			};
		},
		inject: ['dataModel'],
		created() {

		},
		methods: {


		}
	};
</script>

<style>
</style>