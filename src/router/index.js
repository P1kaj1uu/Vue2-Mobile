import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入所需要的组件
import Login from '../views/Login/index.vue'
import Layout from '../views/Layout/index.vue'
import Home from '../views/Home/index.vue'
import User from '../views/User/index.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/layout' },
  { path: '/login', component: Login },
  {
    path: '/layout',
    component: Layout,
    redirect: '/layout/home',
    children: [
      { path: 'home', component: Home },
      { path: 'user', component: User }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
