import {get} from './base'//获取封装好的get方法

// 获取轮播图和推荐列表接口路由，向外暴露一个函数
export function getRecommend(){
    return get('/api/getRecommend')
}