import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入flexible.js，设置移动端根标签字体大小
import 'amfe-flexible'
// 注册Vant组件库
import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
