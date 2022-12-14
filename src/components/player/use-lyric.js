import { useStore } from "vuex";
import {computed,watch,ref} from 'vue'
import { getLyric } from "@/service/song";
import Lyric from "lyric-parser";


export default function useLyric({songReady,currentTime}){
    const currentLyric = ref(null)//lyric-parser 解析的当前的歌词遍历他就可以拿到每一行歌词,currentLyric就是一个数组里面存储了每一句歌词
    const currentLineNum = ref(0)//当前显示的歌曲的行号
    const pureMusicLyric = ref('')//纯音乐
    const playingLyric = ref('')// middle left的当前歌词
    const lyricScrollRef = ref(null)
    const lyricListRef = ref(null)

    const store = useStore()
    const currentSong = computed(()=>store.getters.currentSong)

    watch(currentSong,async (newSong)=>{
        if(!newSong.url || !newSong.id){
            return
        }

        // 切换多了歌词来回跳,,清理一些东西
        stopLyric()//切歌之前把歌停掉
        currentLyric.value = null
        currentLineNum.value = 0
        pureMusicLyric.value = ''
        playingLyric.value = ''

        //
        const lyric = await getLyric(newSong)
        // 因为不管之前有没有请求国都会在请求一次，将播放的歌曲的歌词数据都保存在，原来歌曲的列表中
        // 在原来歌曲的列表上加一个lyric属性，然后值为获取到的歌词
        // 如果这个歌曲有lyric属性，说明已经请求过了，有缓存，就不用重新请求
        // 判断与没有这个属性在请求数据的时候判断
        store.commit('addSongLyric',{
            song:newSong,
            lyric:lyric
        })
        if(currentSong.value.lyric !== lyric){//如果在getLyric过程中有切换了歌曲，那么上一首歌获取的lyric，和当前的歌曲的lyric就是不一样的
            return 
        }

        currentLyric.value = new Lyric(lyric,handleLyric)//每次都会触发handleLyric
        const hasLyric = currentLyric.value.lines.length//如果这个歌的歌词没有长度，表明纯音乐
        if(hasLyric){
            if(songReady.value){//如果歌曲准备好了
                playLyric()//播放歌词
            } 
        }else{
            playingLyric.value= pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
        }
               
    })



    
     
    
    function playLyric(){//播放歌词的函数
        const currentLyricVal = currentLyric.value
        if(currentLyricVal){
            currentLyricVal.seek(currentTime.value * 1000)
        }
    }

    function stopLyric(){//暂停之后，歌词的滚动也应该停止
        const currentLyricVal = currentLyric.value
        if(currentLyricVal){
            currentLyricVal.stop()
        } 
    }

    function handleLyric({lineNum,txt}){//记录行号
        currentLineNum.value = lineNum
        // txt可以拿到当前的歌词
        playingLyric.value = txt
        const scrollComp = lyricScrollRef.value
        const listEl = lyricListRef.value

        if(!listEl){
            return
        }
        if(lineNum > 5){
            const lineEl = listEl.children[lineNum - 5]//为了让他滚动的位置靠中间一点
            scrollComp.scroll.scroll._value.scrollToElement(lineEl,1000)
        }else{
            scrollComp.scroll.scroll._value.scrollTo(0,0,1000)
        }
    }

  


    return {
        currentLyric,
        currentLineNum,
        playLyric,
        lyricScrollRef,
        lyricListRef,
        stopLyric,
        pureMusicLyric,
        playingLyric
    }
}