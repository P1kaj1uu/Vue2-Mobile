<template>
 <div class="user-follow-container">
   <!-- Header 区域 -->
  <van-nav-bar title="关注列表" left-arrow @click-left="$router.back()" fixed />

  <!-- 关注列表区域 -->
  <van-list
    v-model="loading"
    :finished="finished"
    offset="50"
    :immediate-check="false"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <van-cell v-for="(item, index) in userFollowList" :key="index" >
      <template #icon>
        <img :src="item.photo" alt="" class="avatar">
      </template>
      <template #title>
        <span class="username">{{ item.name }}</span>
      </template>
      <template #default>
        <div>
          <van-button type="info" size="mini" >已关注</van-button>
        </div>
      </template>
    </van-cell>
  </van-list>
 </div>
</template>

<script>
// 导入封装的api方法
import { getUserFollowedAPI } from '../../api/index'

export default {
  name: 'UserFollow',
  data () {
    return {
      // 底部加载状态
      loading: false,
      // 数据是否全部加载完成
      finished: false,
      // 用于存储用户关注列表
      userFollowList: []
    }
  },
  methods: {
    // 底部加载事件
    onLoad () {}
  },
  async created () {
    const res = await getUserFollowedAPI()
    if (res.status === 200) {
      this.userFollowList = res.data.data.results
      console.log(res)
      // 当暂无关注时
      if (res.data.data.results.length === 0) {
        this.loading = false
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background-color: #007bff;
}
/deep/ .van-nav-bar__title {
  color: white;
}
/deep/ .van-nav-bar .van-icon {
  color: white;
}
.user-follow-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
/deep/ .username {
  display: inline-block;
  margin-top: 15px;
  margin-left: 5px;
}
</style>
