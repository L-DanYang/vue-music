import { createRouter, createWebHashHistory } from 'vue-router'

import Recommend from '@/views/recommend'
import Search from '@/views/search'
import Singer from '@/views/singer'
import Toplist from '@/views/top-list'


const routes = [
  {
    path:'/',
    redirect:'/recommend'
  },
  {
    path:'/recommend',
    component:Recommend
  },
  {
    path:'/singer',
    component:Singer
  },
  {
    path:'/top-list',
    component:Toplist
  },
  {
    path:'/search',
    component:Search
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
