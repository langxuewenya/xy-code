<template>
 
  <div class="diy-phone-container">
    <!--顶部设置栏-->
    <div class="diy-phone-item">
      <Setpages :diyData="diyData"></Setpages>
    </div>

    <div class="wrapper">
      <div class="diy-phone-item" v-for="(item, index) in diyData.items" :key="item.id">
        <!-- 图片轮播 -->
        <template v-if="item.type == 'banner'">
          <Banner :item="item" :index="index" :selectedIndex="form.selectedIndex"></Banner>
        </template>
        <!-- 图片-->
        <template v-else-if="item.type == 'imageSingle'">
          <ImageSingle :item="item" :index="index" :selectedIndex="form.selectedIndex"></ImageSingle>
        </template>
        <!-- 橱窗-->
        <template v-else-if="item.type == 'window'">
          <Window :item="item" :index="index" :selectedIndex="form.selectedIndex"></Window>
        </template>
        <!-- 视频组-->
        <template v-else-if="item.type == 'video'">
          <Video :item="item" :index="index" :selectedIndex="form.selectedIndex"></Video>
        </template>
        <!--文章-->
        <template v-else-if="item.type == 'article'">
          <Articleindex :item="item" :index="index" :selectedIndex="form.selectedIndex"></Articleindex>
        </template>
        <!--头条快报-->
        <template v-else-if="item.type == 'special'">
          <Special :item="item" :index="index" :selectedIndex="form.selectedIndex"></Special>
        </template>
        <!--公告组-->
        <template v-else-if="item.type == 'notice'">
          <Notice :item="item" :index="index" :selectedIndex="form.selectedIndex"></Notice>
        </template>
        <!--导航组-->
        <template v-else-if="item.type == 'navBar'">
          <NavBar :item="item" :index="index" :selectedIndex="form.selectedIndex"></NavBar>
        </template>
        <!--商品组-->
        <template v-else-if="item.type == 'lecturer'">
          <Lecturer :item="item" :index="index" :selectedIndex="form.selectedIndex"></Lecturer>
        </template>
        <!--客服-->
        <template v-else-if="item.type == 'service'">
          <Service :item="item" :index="index" :selectedIndex="form.selectedIndex"></Service>
        </template>
        <!--富文本-->
        <template v-else-if="item.type == 'richText'">
          <RichText :item="item" :index="index" :selectedIndex="form.selectedIndex"></RichText>
        </template>
        <!--辅助空白-->
        <template v-else-if="item.type == 'blank'">
          <Blank :item="item" :index="index" :selectedIndex="form.selectedIndex"></Blank>
        </template>
        <!--辅助线-->
        <template v-else-if="item.type == 'guide'">
          <Guide :item="item" :index="index" :selectedIndex="form.selectedIndex"></Guide>
        </template>
        <!--标题-->
        <template v-else-if="item.type == 'title'">
          <Title :item="item" :index="index" :selectedIndex="form.selectedIndex"></Title>
        </template>
		<!--标题-->
		<template v-if="form.curItem.type == 'exam'">
		  <Exam :curItem="form.curItem" :selectedIndex="form.selectedIndex"></Exam>
		</template>
        <!--标题-->
        <template v-if="form.curItem.type == 'train'">
          <Train :curItem="form.curItem" :selectedIndex="form.selectedIndex"></Train>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import Setpages from './model/Setpages.vue';
  import Banner from './model/Banner.vue';
  import ImageSingle from './model/ImageSingle.vue';
  import Window from './model/Window.vue';
  import Video from './model/Video.vue';
  import Articleindex from './model/Article.vue';
  import Special from './model/Special.vue';
  import Notice from './model/Notice.vue';
  import NavBar from './model/NavBar.vue';
  import Lecturer from './model/Lecturer.vue';
  import Service from './model/Service.vue';
  import RichText from './model/RichText.vue';
  import Blank from './model/Blank.vue';
  import Guide from './model/Guide.vue';
  import Title from './model/Title.vue';
  import Train from './model/Train.vue';
  import Exam from './model/Exam.vue';
  import Education from './model/Education.vue';
  import draggable from 'vuedraggable';
  export default {
    components: {
      /*顶部状态栏*/
      Setpages,
      /*图片轮播组件*/
      Banner,
      /*图片组件*/
      ImageSingle,
      /*图片橱窗*/
      Window,
      /*视频*/
      Video,
      /*文章*/
      Articleindex,
      /*头条快报*/
      Special,
      /*公告组*/
      Notice,
      /*导航组*/
      NavBar,
      /*商品组*/
      Lecturer,
      /*客服*/
      Service,
      /*富文本*/
      RichText,
      /*辅助空白*/
      Blank,
      /*辅助线*/
      Guide,
      /*拖动*/
      draggable,
      /*标题*/
      Title,
      Train,
      Exam,
	  Education
    },
    data() {
      return {};
    },
    props: {
      form: Object,
      defaultData: Object,
      diyData: Object
    },
    created() {
      console.log(this.diyData)
    },
    methods: {
      /*删除diy元素*/
      onDeleleItem: function(index) {
        let self = this;
       ElMessageBox.confirm('确定要删除吗?', '提示', {
            type: 'warning'
          })
          .then(() => {
            self.diyData.items.splice(index, 1);
            self.form.selectedIndex = -1;
          });
      },

      /*编辑当前选中的Diy元素*/
      onEditer: function(index) {
        let self = this;
        // 记录当前选中元素的索引
        self.form.selectedIndex = index;
        // 当前选中的元素数据
        self.form.curItem = self.form.selectedIndex < 0 ? self.diyData.page : self.diyData.items[self.form
          .selectedIndex];
        // 注册编辑器事件
        //self.initEditor();
      },

      /* 注册编辑器事件*/
      initEditor: function() {
        let self = this;
        // 注册dom事件
        self.$nextTick(function() {
          // 销毁 umeditor 组件
          if (self.form.umeditor.hasOwnProperty('key')) {
            self.form.umeditor.destroy();
          }
          // 注册html组件
          self.editorHtmlComponent();
          // 富文本事件
          if (self.form.curItem.type === 'richText') {
            //self.onRichText(self.form.curItem);
          }
        });
      },

      /*编辑器事件：html组件*/
      editorHtmlComponent: function() {
        let self = this;
        var editor = self.$refs['diy-editor'];
        // 单/多选框
        //editor.find('input[type=checkbox], input[type=radio]').uCheck();
        // select组件
        // $editor.find('select').selected();
      }
    }
  };
</script>

<style>
  .diy-phone-container {
    position: relative;
    height: calc(100vh - 150px);
  }

  .diy-phone-container .wrapper {
    height: calc(100% - 90px);
    overflow-y: auto;
  }

  .diy-phone-container .phone-top {
    padding: 0 20px;
    border-radius: 18px 18px 0 0;
  }

  .diy-phone-container .phone-top .status-bar {
    height: 20px;
    display: flex;
    justify-content: space-between;
  }

  .diy-phone-container .phone-top .svg-icon {
    width: 20px;
    height: 20px;
    color: #333333;
  }

  .diy-phone-container .phone-top .navigation {
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 18px;
  }

  .diy-phone-container .diy-phone-item {}

  .diy-phone-container .diy-phone-item>div {
    position: relative;
    border: 2px solid #f1f1f2;
  }

  .diy-phone-container .diy-phone-item>div:hover,
  .diy-phone-container .diy-phone-item.active>div {
    border: 2px dashed #3a8ee6;
  }

  .diy-phone-container .diy-phone-item .btn-edit-del {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 10;
  }

  .diy-phone-container .diy-phone-item .btn-edit-del>div {
    width: 32px;
    height: 16px;
    line-height: 16px;
    display: inline-block;
    text-align: center;
    font-size: 10px;
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
    margin-left: 2px;
    cursor: pointer;
  }

  .diy-phone-container img {
    width: 100%;
  }
</style>
