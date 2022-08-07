import { useStore } from "vuex";
import {computed} from 'vue'
import { PLAY_MODE } from "@/assets/js/constant";

export default function useMode(){
    const store = useStore()
    const playMode = computed(()=>store.state.playMode)

    const modeIcon = computed(()=>{//动态决定播放顺序的图标
        const playModeVal = playMode.value
        return playModeVal === PLAY_MODE.sequence ? 'icon-sequence' : playModeVal === PLAY_MODE.random ? 'icon-random' : 'icon-loop'
    })

    const modeText = computed(()=>{
        const playModeVal = playMode.value
        return playModeVal === PLAY_MODE.sequence ? '顺序播放' : playModeVal === PLAY_MODE.random ? '随机播放' : '单曲循环'
        
    })

    function changeMode(){//点击切换播放顺序，并且刷新歌单
        const mode = (playMode.value + 1) % 3
        store.dispatch('changeMode',mode)
    }


    return {
        modeIcon,
        changeMode,
        modeText
    }
}