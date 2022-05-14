<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>
    <!-- 搜索结果内容 -->
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        offset="50"
        :immediate-check="false"
        @load="onLoad"
      >
        <article-item
        v-for="obj in historyList"
        :key="obj.art_id"
        :obj="obj"
        :isShow="false"
        ></article-item>
      </van-list>
    </div>
  </div>
</template>

<script>
// 导入封装的api方法
import { searchResultListAPI } from '../../api/index'
// 导入封装的时间格式方法
import { timeAgo } from '../../utils/day'
// 导入需要的组件
import ArticleItem from '../../components/ArticleItem.vue'

export default {
  name: 'SearchResult',
  components: {
    ArticleItem
  },
  data () {
    return {
      // 用于存储搜索历史文章列表
      historyList: [],
      // 底部加载状态
      loading: false,
      // 数据是否全部加载完成
      finished: false,
      page: 1
    }
  },
  methods: {
    timeAgo: timeAgo,
    // 底部加载事件
    async onLoad () {
      if (this.historyList.length > 0) {
        this.page++
        this.getHistoryList()
      }
    },
    // 封装获取历史列表文章的方法
    async getHistoryList () {
      const res = await searchResultListAPI({
        page: this.page,
        q: this.$route.params.keywords
      })
      // 当成功发起网络请求时
      if (res.status === 200) {
        // 更多数据判断
        if (res.data.data.results.length === 0) {
          this.finished = true
          return
        }
        // 时间日期格式处理
        res.data.data.results.forEach((obj) => {
          obj.pubdate = this.timeAgo(obj.pubdate)
        })
        this.historyList = [...this.historyList, ...res.data.data.results]
        this.loading = false
      }
    }
  },
  created () {
    this.getHistoryList()
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background-color: #007BFF;
}
/deep/ .van-nav-bar__title {
  color: white;
}
/deep/ .van-nav-bar .van-icon {
  color: white;
}
.search-result-container {
  padding-top: 46px;
}
</style>
