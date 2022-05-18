<template>
 <div>
   <!-- 组件缓存 -->
   <keep-alive exclude="Search,SearchResult,ArticleDetail,UserEdit,UserFan,UserFollow">
     <router-view></router-view>
   </keep-alive>
 </div>
</template>

<script>
// 导入封装的接口方法
import { getAllChannelsAPI } from './api/index.js'

export default {
  name: '',
  data () {
    return {

    }
  },
  components: {

  },
  async created () {
    // try+catch 捕获错误异常
    try {
      await getAllChannelsAPI()
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
