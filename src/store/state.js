import { PLAY_MODE,FAVORITE_KEY } from "@/assets/js/constant"
import { load } from "@/assets/js/array-store"

const state = {
    
    sequenceList:[],// 首先要有一个数据播放列表
    playList:[],//真正的播放列表
    playing:false,//歌曲是否播放
    playMode:PLAY_MODE.sequence,//歌曲的播放顺序，默认顺序播放
    currentIndex:0,//当前播放歌曲
    fullScreen:false,//收缩屏幕还是展开屏幕
    
    favoriteList:load(FAVORITE_KEY),//定义收藏列表,每次加载都从以前FAVORITE_KEY里面把收藏的歌曲都加载出来
}

export default state