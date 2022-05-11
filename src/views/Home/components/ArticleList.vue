<template>
  <div>
    <!-- 文章列表 -->
    <article-item
      v-for="item in articleList"
      :key="item.art_id"
      :obj="item"
    ></article-item>
  </div>
</template>

<script>
import ArticleItem from '../components/ArticleItem.vue'
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
      articleList: []
    }
  },
  components: {
    ArticleItem
  },
  methods: {
    timeAgo: timeAgo
  },
  async created () {
    const res = await articlesListAPI({
      channel_id: this.cid,
      timestamp: (new Date()).getTime()
    })
    if (res.status === 200) {
      // 回来的数据进行预处理, 把时间转成多久多久之前
      res.data.data.results.forEach((obj) => {
        obj.pubdate = this.timeAgo(obj.pubdate)
      })
      this.articleList = res.data.data.results
    }
    console.log(res)
  }
}
</script>
