<template>
 <div>
   <!-- 搜索页面头部 -->
   <div class="search-header">
     <!-- 后退按钮 -->
     <van-icon name="arrow-left" size="0.48rem" class="goBack" color="white" @click="ToBack" />
     <!-- 搜索组件 -->
     <van-search
     v-model.trim="kw"
     v-focus
     placeholder="请输入搜索关键词"
     background="#007BFF"
     shape="round"
     @input="inputFn"
     @search="searchFn"
     />
   </div>
   <!-- 搜索建议列表 -->
   <div class="suggest-list" v-if="kw.length !== 0">
     <div class="suggest-item" v-for="(str, index) in suggestList" :key="index" @click="suggestClickFn(str)">
       {{ str }}
     </div>
   </div>
   <!-- 搜索历史记录 -->
   <div class="search-history" v-else>
    <!-- 标题 -->
    <van-cell title="搜索历史">
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #right-icon>
        <van-icon name="delete" class="search-icon" @click="clearHistory" />
      </template>
    </van-cell>
    <!-- 历史列表 -->
    <div class="history-list">
      <span class="history-item" v-for="(str, index) in history" :key="index" @click="historyClickFn(str)">
        {{ str }}
      </span>
    </div>
   </div>
 </div>
</template>

<script>
// 导入封装的api
import { suggestListAPI } from '../../api/index.js'

export default {
  name: 'Search',
  data () {
    return {
      // 搜索关键字
      kw: '',
      // 用于保存防抖的定时器
      timer: null,
      // 用于存储搜索建议列表
      suggestList: [],
      // 用于保存搜索历史记录
      history: JSON.parse(localStorage.getItem('record')) || []
    }
  },
  methods: {
    // 当点击后退按钮时
    ToBack () {
      this.$router.back()
    },
    // 当输入框内容变化时触发
    inputFn () {
      // 防抖：延时执行逻辑代码，事件再次触发时，清除上一个定时器
      clearTimeout(this.timer)
      if (this.kw.length === 0) {
        // 清空搜索建议框内容
        this.suggestList = []
      } else {
        this.timer = setTimeout(async () => {
          // 发起网络请求
          const res = await suggestListAPI({
            q: this.kw
          })
          if (res.status === 200) {
            this.suggestList = res.data.data.options
            console.log(this.kw)
          }
        }, 500)
      }
    },
    // 当输入框确定搜索时触发
    searchFn () {
      if (this.kw.length > 0) {
        // 保存搜索历史
        this.history.push(this.kw)
        // 去重
        this.history = [...(new Set(this.history))]
        // 延迟跳转到搜索结果页面，以便本地存储历史记录
        setTimeout(() => {
          this.$router.push(`/search/${this.kw}`)
        }, 0)
      }
    },
    // 当点击搜索建议列表时
    suggestClickFn (str) {
      // 保存搜索历史
      this.history.push(str)
      // 去重
      this.history = [...(new Set(this.history))]
      // 延迟跳转到搜索结果页面，以便本地存储历史记录
      setTimeout(() => {
        this.$router.push(`/search/${str}`)
      }, 0)
    },
    // 当点击历史列表时
    historyClickFn (str) {
      // 跳转到搜索结果页面
      this.$router.push(`/search/${str}`)
    },
    // 点击清空历史记录
    clearHistory () {
      this.history = []
    }
  },
  watch: {
    history: {
      deep: true,
      handler () {
        localStorage.setItem('record', JSON.stringify(this.history))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-header {
  display: flex;
  align-items: center;
  height: 46px;
  overflow: hidden;
  background-color: #007bff;

  .goBack {
    padding-left: 14px;
  }

  .van-search {
    flex: 1;
  }
}

.suggest-list .suggest-item {
  padding: 0 15px;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #f8f8f8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
