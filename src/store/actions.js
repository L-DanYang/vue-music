import { PLAY_MODE } from "@/assets/js/constant"
import { shuffle } from "@/assets/js/util"

export function selectPlay({commit},{list,index}){
    commit('setPlayMode',PLAY_MODE.sqeuence)
    commit('setSquenceList',list)
    commit('setPlayingState',true)
    commit('setFullScreen',true)
    commit('setPlayList',list)
    commit('setCurrentIndex',index)
}

export function randomPlay({commit},list){//实现随机播放
    commit('setPlayMode',PLAY_MODE.random)
    commit('setSquenceList',list)
    commit('setPlayingState',true)
    commit('setFullScreen',true)
    commit('setPlayList',shuffle(list))
    commit('setCurrentIndex',0)
}