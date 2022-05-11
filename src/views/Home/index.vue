<template>
  <div>
    <!-- 头部导航区域 -->
    <div class="homeTop">
      <van-nav-bar fixed>
        <template #left>
          <img :src="imgHome" alt="IT头条" />
        </template>
        <template #right>
          <van-icon name="search" size="0.48rem" />
        </template>
      </van-nav-bar>
    </div>
    <!-- tab栏导航区域 -->
    <div class="homeTab">
      <van-tabs v-model="channelId" sticky animated offset-top="1.226667rem">
        <van-tab v-for="item in userChannelList" :key="item.id" :title="item.name" :name="item.id">
          <article-list :cid="channelId"></article-list>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import imgLogo from '../../assets/toutiao_logo.png'
import { getUserChannelAPI } from '../../api/index.js'
import ArticleList from '../Home/components/ArticleList.vue'

export default {
  name: 'Home',
  components: {
    ArticleList
  },
  data () {
    return {
      imgHome: imgLogo,
      // 默认频道id为0
      channelId: 0,
      // 用于存储用户频道数据
      userChannelList: []
    }
  },
  async created () {
    const res = await getUserChannelAPI()
    if (res.status === 200) {
      this.userChannelList = res.data.data.channels
      console.log(res)
    }
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
/deep/ .van-tabs__nav .van-tabs__line {
  background-color: #007bff;
}
</style>
