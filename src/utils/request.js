// 基于axios封装的请求模块
import theAxios from 'axios'
// 引入路由对象
import router from '../router/index'
// 导入封装的token方法
// import { getToken } from '../utils/token'
import { Notify } from 'vant'

const axios = theAxios.create({
  baseURL: 'http://geek.itheima.net/',
  // 设置20秒超时时间
  timeout: 20000
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // ?.是可选链操作符，如果前面对象没有length，原地返回undefined
  // 如果getToken()再原地有值token字符串，才能调用length获取长度
  // if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
  //   config.headers.Authorization = 'Bearer ' + getToken()
  // }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // http状态码为2xx,3xx时
  // 对响应数据做点什么
  return response
}, function (error) {
  // http状态码为4xx,5xx时
  // 对响应错误做点什么
  if (error.response.status === 401) {
    // 身份token过期,用户未认证
    // 此处不能使用this.$router,this指向undefined
    Notify({ type: 'warning', message: '身份认证已过期' })
    router.replace('/login')
  }
  return Promise.reject(error)
})

export default axios
