<template>

  <div class="statistics-member" v-loading="loading" style="min-height: 400px;">
    <div class="common-form">会员统计</div>
    <div class="d-s-stretch bd-box">
      <div class="d-s-c d-c left-box">

         <!--汇总-->
         <Total v-if="!loading"></Total>

        <!--新增会员-->
        <LineChart v-if="!loading"></LineChart>
      </div>
    </div>

    <!--排行榜-->
    <Ranking v-if="!loading"></Ranking>

  </div>
</template>

<script>
import StatisticsApi from '@/api/statistics.js';
import Total from './part/Total.vue';
import LineChart from './part/LineChart.vue';
import Ranking from './part/Ranking.vue'
export default {
  components: {
    Total,
    LineChart,
    Ranking
  },
  data(){
    return{
      /*是否正在加载*/
      loading:true,
      /*数据对象*/
      dataModel:{}
    }
  },
  provide: function () {
    return {
      dataModel: this.dataModel
    }
  },
  created() {

    this.getData();
  },
  methods:{

    /*获取数据*/
    getData() {
      let self = this;
      StatisticsApi.getUserTotal({}, true)
        .then(res => {
          Object.assign(self.dataModel, res.data);
          self.loading = false;
        })
        .catch(error => {});
    }

  }
};
</script>

<style scoped="scoped">
  .statistics-member .bd-box{ border-top: 1px solid #EEEEEE;}
  .statistics-member .left-box{ width: 100%;}
</style>
