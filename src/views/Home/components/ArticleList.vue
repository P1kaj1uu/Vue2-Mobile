<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        offset="50"
        :immediate-check="false"
        @load="onLoad"
      >
        <!-- 文章列表 -->
        <article-item
          v-for="item in articleList"
          :key="item.art_id"
          :obj="item"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '../../../components/ArticleItem.vue'
import { articlesListAPI } from '../../../api/index.js'
// 导入封装时间格式的方法
import { timeAgo } from '../../../utils/day.js'

export default {
  name: 'ArticleList',
  props: {
    cid: Number
  },
  data () {
    return {
      // 用于存储文章新闻推荐数据
      articleList: [],
      // 底部加载状态
      loading: false,
      // 数据是否全部加载完成
      finished: false,
      // 下拉刷新
      refreshing: false,
      theTime: (new Date()).getTime()
    }
  },
  components: {
    ArticleItem
  },
  methods: {
    timeAgo: timeAgo,
    // 底部加载事件
    async onLoad () {
      const res = await articlesListAPI({
        channel_id: this.cid,
        // 默认用系统时间，展示第一页的数据
        timestamp: this.theTime
      })
      if (res.status === 200) {
      // 回来的数据进行预处理, 把时间转成多久多久之前
        res.data.data.results.forEach((obj) => {
          obj.pubdate = this.timeAgo(obj.pubdate)
        })
        // 拼接请求回来的新数据
        this.articleList = [...this.articleList, ...res.data.data.results]
        // pre_timestamp是下一段文章开头的时间戳
        this.theTime = res.data.data.pre_timestamp
        // 关闭加载效果
        this.loading = false
        // 判断是否还有下一页数据
        if (res.data.data.pre_timestamp === null) {
          // 关闭加载
          this.finished = true
        }
      }
      console.log(res)
    },
    // 下拉刷新事件
    onRefresh () {
      // 清空列表数据
      this.articleList = []
      // 重新获取数据
      this.onLoad()
      // 关闭下拉刷新
      this.refreshing = false
    }
  },
  async created () {
    const res = await articlesListAPI({
      channel_id: this.cid,
      // 默认用系统时间，展示第一页的数据
      timestamp: this.theTime
    })
    if (res.status === 200) {
      // 回来的数据进行预处理, 把时间转成多久多久之前
      res.data.data.results.forEach((obj) => {
        obj.pubdate = this.timeAgo(obj.pubdate)
      })
      this.articleList = res.data.data.results
      // pre_timestamp是下一段文章开头的时间戳
      this.theTime = res.data.data.pre_timestamp
    }
    console.log(res)
  }
}
</script>
