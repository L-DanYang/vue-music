import { createRouter, createWebHashHistory } from 'vue-router'

import Recommend from '@/views/recommend'
  import Album from '@/views/album'
import Search from '@/views/search'
import Singer from '@/views/singer'
  import SingerDetail from '@/views/singer-detail'
import Toplist from '@/views/top-list'


const routes = [
  {
    path:'/',
    redirect:'/recommend'
  },
  {
    path:'/recommend',
    component:Recommend,
    children:[
      {
        path:':id',
        component:Album
      }
    ]
  },
  {
    path:'/singer',
    component:Singer,
    children:[
      {
        path:':id',
        component:SingerDetail
      }
    ]
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
