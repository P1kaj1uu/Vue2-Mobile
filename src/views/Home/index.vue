<template>
  <div>
    <!-- 头部导航区域 -->
    <div class="homeTop">
      <van-nav-bar fixed>
        <template #left>
          <img :src="imgHome" alt="IT头条" />
        </template>
        <template #right>
          <van-icon name="search" size="0.48rem" @click="ToSearch" />
        </template>
      </van-nav-bar>
    </div>
    <!-- tab栏导航区域 -->
    <div class="homeTab">
      <van-tabs v-model="channelId" sticky animated offset-top="1.226667rem" @change="tabsChangeFn" >
        <van-tab v-for="item in userChannelList" :key="item.id" :title="item.name" :name="item.id">
          <article-list :cid="channelId"></article-list>
        </van-tab>
      </van-tabs>
      <!-- 编辑频道图标 -->
      <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="showPopup" />
    </div>
    <!-- 频道弹出层 -->
    <van-popup v-model="show" class="edit_wrap">
      <channel-edit
      :userChannel="userChannelList"
      @close="closeFn"
      @addChannel="addFn"
      @remove="removeFn"
      @changeChannel="changeFn"
      ref="resetEdit"
      >
      </channel-edit>
    </van-popup>
  </div>
</template>

<script>
import imgLogo from '../../assets/toutiao_logo.png'
import { getUserChannelAPI, updateChannelAPI, deleteChannelAPI } from '../../api/index.js'
import ArticleList from '../Home/components/ArticleList.vue'
import ChannelEdit from './ChannelEdit.vue'

export default {
  name: 'Home',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      imgHome: imgLogo,
      // 默认频道id为0
      channelId: 0,
      // 用于存储用户频道数据
      userChannelList: [],
      show: false,
      // 频道切换，保存每个频道的滚动位置=>{ 频道ID: 滚动位置 }
      channelScrollTObj: {}
    }
  },
  async created () {
    const res = await getUserChannelAPI()
    if (res.status === 200) {
      this.userChannelList = res.data.data.channels
    }
  },
  methods: {
    // 点击图标弹出弹出层
    showPopup () {
      this.show = true
    },
    // 点击关闭弹出层
    closeFn () {
      this.show = false
      // 重置弹出层内容
      this.$refs.resetEdit.isEdit = false
    },
    // 添加频道
    async addFn (channelObj) {
      this.userChannelList.push(channelObj)
      await updateChannelAPI({
        channels: this.userChannelList
      })
    },
    // 删除频道
    async removeFn (channelObj) {
      const index = this.userChannelList.findIndex(obj => obj.id === channelObj.id)
      this.userChannelList.splice(index, 1)
      // 调用删除频道的api
      await deleteChannelAPI({
        target: channelObj.id
      })
    },
    // 跳转对应的频道内容
    changeFn (obj) {
      this.channelId = obj.id
    },
    // 点击搜索图标跳转搜索页面
    ToSearch () {
      this.$router.push('/search')
    },
    // 封装滚动条滚动事件
    scrollFn () {
      this.$route.meta.scrollT = document.documentElement.scrollTop
      // 同时保存当前频道的滚动位置
      this.channelScrollTObj[this.channelId] = document.documentElement.scrollTop
    },
    // 当tab选项栏频道切换时
    tabsChangeFn () {
      this.$nextTick(() => {
        window.scrollTo(0, this.channelScrollTObj[this.channelId])
      })
    }
  },
  // 使用缓存组件后，激活生命周期函数触发
  activated () {
    // 实时监听滚动事件
    window.addEventListener('scroll', this.scrollFn)
    // 切换到离开前滚动条的位置
    window.scrollTo(0, this.$route.meta.scrollT)
  },
  // 使用缓存组件后，失去激活生命周期函数触发
  deactivated () {
    // 移除全局注册的事件
    window.removeEventListener('scroll', this.scrollFn)
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background-color: #007bff;
}
.van-nav-bar img {
  width: 100px;
  height: 30px;
}
.van-nav-bar .van-icon {
  color: white;
}
// tab内容距离tab导航的距离
.homeTab {
    padding-top: 46px;
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}
/deep/ .van-tabs__nav .van-tabs__line {
  background-color: #007bff;
}
// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
.edit_wrap {
  width: 100%;
  height: 100%;
}
</style>
