import { useStore } from "vuex"
import {computed} from 'vue'
import {save,remove} from '@/assets/js/array-store'
import { FAVORITE_KEY } from "@/assets/js/constant"


export default function useFavorite(){
    const store = useStore()
    const maxLen = 500
    const favoriteList = computed(()=>store.state.favoriteList)
    
    function getFavoriteIcon(song){//根据歌曲是否在列表中动态改变喜欢按钮的样式
        return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
    }

    function toggleFavorite(song){//操作歌曲把歌曲添加到列表中或者溢出
        let list
        if (isFavorite(song)){
            list = remove(FAVORITE_KEY,compare)
        }else{
            list = save(song,FAVORITE_KEY,compare,maxLen)
        }

        store.commit('setFavoriteList',list)

        function compare(item){//判断是否是同一个歌
            return item.id === song.id
        }
    }

    function isFavorite(song){//查找当前歌曲有没有在收藏列表里面
        return favoriteList.value.findIndex((item)=>{
            return item.id === song.id
        }) > -1
    }

   
    return {
        getFavoriteIcon,
        toggleFavorite
    }
}