// 基于axios封装的请求模块
import theAxios from 'axios'
// 引入路由对象
import router from '../router/index'
// 导入封装的token方法
import { removeToken, setToken } from '../utils/token'
import { Notify } from 'vant'
import { refreshTokenAPI } from '../api/index'

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
}, async function (error) {
  // http状态码为4xx,5xx时
  // 对响应错误做点什么
  if (error.response.status === 401) {
    // 身份token过期,用户未认证
    // 此处不能使用this.$router,this指向undefined
    // Notify({ type: 'warning', message: '身份认证已过期' })
    // 移除token
    removeToken()
    // 方式一，用户有感知
    // router.replace('/login')
    // 方式二，用户无感知
    const res = await refreshTokenAPI()
    // 更新token在本地
    setToken(res.data.data.token)
    // 更新新的token在请求头里
    error.config.headers.Authorization = 'Bearer ' + res.data.data.token
    // 再调用一次未完成的请求,把新的token赋予到下一次axios请求的请求头中
    // error.config就是上一次axios请求的配置对象
    return axios(error.config)
  } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
    // 当刷新的refresh_token也过期时
    Notify({ type: 'warning', message: '身份认证已过期' })
    // 移除token
    removeToken()
    localStorage.removeItem('refresh_token')
    // 返回当前页面
    router.replace(`/login?path=${router.currentRoute.fullPath}`)
  }
  return Promise.reject(error)
})

export default axios
