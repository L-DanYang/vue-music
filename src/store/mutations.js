// 对原始数据做修改的
const mutations ={

    setPlayingState(state,playing){//设置歌曲是否播放
        state.playing = playing
    },
    setSquenceList(state,list){//设置播放的列表
        state.sequenceList = list
    },
    setPlayList(state,list){//设置真正的源歌曲列表
        state.playList = list
    },
    setPlayMode(state,mode){//设置歌曲播放的顺序
        state.playMode = mode
    },
    setCurrentIndex(state,index){//设置当前播放的歌曲的索引
        state.currentIndex= index
    },
    setFullScreen(state,fullScreen){//设置屏幕收缩
        state.fullScreen = fullScreen
    }
}

export default mutations

