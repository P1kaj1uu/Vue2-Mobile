import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入所需要的组件
import Login from '../views/Login/index.vue'
import Layout from '../views/Layout/index.vue'
import Home from '../views/Home/index.vue'
import User from '../views/User/index.vue'
import Search from '../views/Search/index.vue'
import SearchResult from '../views/Search/SearchResult.vue'

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
  },
  { path: '/search', component: Search },
  { path: '/search/:keywords', component: SearchResult }
]

const router = new VueRouter({
  routes
})

export default router
