<template>

    <el-select v-model="activePage" placeholder="请选择" class="percent-w100" @change="changeFunc" value-key="url">
        <el-option v-for="item in pages" :key="item.url" :value-key="item.name" :label="item.name" :value="item"></el-option>
    </el-select>
</template>

<script>
    export default{
        data(){
            return {
                /*页面数据*/
                pages: [
                    {
                        url: '/pages/index/index',
                        name: '首页',
                        type: '页面'
                    },
                    {
                        url: '/pages/user/index',
                        name: '我的',
                        type: '页面',
                    },
                    {
                        url: '/pages/knowledge/index',
                        name: '课程',
                        type: '页面',
                    },
                    {
                        url: '/pages/eduadmin/index',
                        name: '教务',
                        type: '页面',
                    },
                    {
                        url: '/pages/examination/index',
                        name: '题库',
                        type: '页面',
                    },
                    {
                        url: '/pages/user/collect/subject',
                        name: '收藏的题',
                        type: '页面',
                    },
                    {
                        url: '/pages/order/category',
                        name: '我的订单',
                        type: '页面',
                    },
                    {
                        url: '/pages/pointsMall/index',
                        name: '积分商城',
                        type: '页面',
                    },
                    {
                        url: '/pages/user/collect/index',
                        name: '我的课程',
                        type: '页面',
                    },
                    {
                        url: '/pages/examination/wrong/list',
                        name: '我的错题',
                        type: '页面',
                    },
                    {
                        url: '/pages/examination/record/list',
                        name: '考试测评',
                        type: '页面',
                    },
                    {
                        url: '/pages/user/lecturer/apply',
                        name: '申请讲师',
                        type: '页面',
                    },
                    {
                        url: '/pages/user/course/exchange',
                        name: '兑换中心',
                        type: '页面',
                    },
                    {
                        url: '/pages/user/extend/index',
                        name: '推广中心',
                        type: '页面',
                    },
                    {
                        url: '/pages/user/booking/list',
                        name: '拼团列表',
                        type: '页面',
                    },
                ],
                /*选中的值*/
                activePage: '首页'
            }
        },
        created() {
          /*初始化*/
          this.changeFunc(this.pages[0]);
        },
        methods: {
            /*选中的值*/
            changeFunc(e){
                this.$emit('changeData', e);
            }
        }
    }
</script>

<style>
</style>
