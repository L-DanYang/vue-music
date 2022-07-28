// 对axios做一层封装
import axios from 'axios';

const ERR_OK = 0
const baseURL ='/'
axios.defaults.baseURL = baseURL

// 封装get方法
export function get(url,params){
    return axios.get(url,{
        params
    }).then((res)=>{
        // 成功则返回数据
        const serverData = res.data
        if(serverData.code === ERR_OK){
            return serverData.result
        }
    }).catch((e)=>{
        // 失败返回错误信息
        console.log(e)
    })
}

