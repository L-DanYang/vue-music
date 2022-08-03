import { PLAY_MODE } from "@/assets/js/constant"
import { shuffle } from "@/assets/js/util"

export function selectPlay({commit},{list,index}){
    commit('setPlayMode',PLAY_MODE.sequence)
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

export function changeMode({commit , state ,getters},mode){//改变歌曲播放顺序的状态，并且切换到随机之后刷新歌曲列表
    // 从顺序播放切换到随机的时候会打断当前的歌曲，切换新歌曲
    // 可以在切换模式之前拿到当前播放的歌曲的ID
    const currentId =  getters.currentSong.id

    if(mode === PLAY_MODE.random){//如果模式为随机，洗牌后
        commit('setPlayList',shuffle(state.sequenceList))
    }else{
        commit('setPlayList',state.sequenceList)
    }
    // 找到当前播放的歌曲在，新的歌曲列表里的位置
    const index = state.playList.findIndex((song)=>{
        return song.id === currentId
    })

    commit('setCurrentIndex',index)//定位新列表中当前的歌曲的索引
    commit('setPlayMode',mode)
}