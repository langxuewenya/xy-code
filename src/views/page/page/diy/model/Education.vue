<template>

  <div class="drag optional p-0-12 box-s-b" :class="{ selected: index === selectedIndex }"
    @click.stop="$parent.$parent.onEditer(index)">
    <div class="diy-Course">
      <div v-for="(litem,index) in item.data" :key="index" class="Course-item">
        <div class="Course-image"><img v-img-url="litem.image"></div>
        <div class="Course-name text-ellipsis-2">{{litem.title}}</div>
        <div class="f16 fb" style="color: #F2473F;">￥10.00</div>
      </div>
    </div>
    <div class="btn-edit-del">
      <div class="btn-del" @click.stop="$parent.$parent.onDeleleItem(index)">删除</div>
    </div>
  </div>
</template>

<script>
  import ProductApi from '@/api/paper.js';
  export default {
    data() {
      return {
        /*分类id*/
        category_id: 0,
      };
    },
    created() {
      /*获取列表*/
      console.log(this.item)
    },
    props: ['item', 'index', 'selectedIndex'],
    methods: {
      /*计算宽度*/
      getUlwidth(item) {
        if (item.style.display == 'slide') {
          let total = 0;
          if (item.params.source == 'choice') {
            total = item.data.length;
          } else {
            total = item.defaultData.length;
          }
          let w = 0;
          if (item.style.column == 2) {
            w = total * 150;
          } else {
            w = total * 100;
          }
          return 'width:' + w + 'px;';
        }
      }
    }
  };
</script>

<style>
  .diy-Course {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    background: #FFFFFF;
    border-radius: 12px;
    padding: 19px 5px;
  }

  .Course-item {
    width: 161px;
    height: 160px;
    box-sizing: border-box;
    margin-right: 6px;
    margin-bottom: 9px;
  }

  .Course-item:nth-of-type(2n) {
    margin-right: 0;
  }

  .Course-image {
    overflow: hidden;
    margin: 0 auto;
    margin-bottom: 5px;
  }

  .Course-image,
  .Course-image>img {
    width: 161px;
    height: 90px;
    border-radius: 7px;
  }

  .Course-name {
    font-size: 13px;
    color: #111111;
    line-height: 1.5;
    height: 39px;
    text-align: left;
  }
</style>
