// 基于axios封装的请求模块
import theAxios from 'axios'
const axios = theAxios.create({
  baseURL: 'http://geek.itheima.net/',
  // 设置20秒超时时间
  timeout: 20000
})

export default axios
