<template>
  <div>
    <div class="home_container">
      <!-- 二级路由页面 -->
      <router-view></router-view>
    </div>

    <!-- 下面的底部导航 -->
    <div>
      <van-tabbar v-model="active">
        <van-tabbar-item replace to="/layout/home" icon="home-o">首页</van-tabbar-item>
        <van-tabbar-item replace to="/layout/user" icon="user-o">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style lang="less" scoped>
// 防止内部被底部导航挡住
.home_container {
  padding-bottom: 50px;
}
// 底部导航上边框
.van-tabbar {
  border-top: 1px solid #f8f8f8;
}
</style>
