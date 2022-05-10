<template>
 <div>
   <router-view></router-view>
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
      const res = await getAllChannelsAPI()
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
