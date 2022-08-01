import { PLAY_MODE } from "@/assets/js/constant"


const state = {
    
    sequenceList:[],// 首先要有一个数据播放列表
    playList:[],//真正的播放列表
    playing:false,//歌曲是否播放
    playMode:PLAY_MODE.sqeuence,//歌曲的播放顺序，默认顺序播放
    currentIndex:0,//当前播放歌曲
    fullScreen:false,//收缩屏幕还是展开屏幕
}

export default state