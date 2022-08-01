export const currentSong = (state) =>{//通过真正的播放列表的当前索引，知道当前播放的歌曲
    return state.playList[state.currentIndex]
}