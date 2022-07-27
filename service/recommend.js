import {get} from './base'

// 获取推荐列表接口路由
export function getRecommend(){
    return get('/api/getRecommend')
}