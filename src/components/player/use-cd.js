import { useStore } from "vuex";
import {computed,ref, watch} from 'vue'

export default function useCD(){
    //ref
    const cdRef = ref(null)
    const cdImageRef = ref(null)
    //引入的store及相关
    const store = useStore()
    const playing = computed(()=>store.state.playing)

    // 计算属性
    const cdCls = computed(()=>{
        return playing.value ? 'playing' : ''
    })

    // watch
    watch(playing,(newPlaying)=>{
        if(!newPlaying){
            syncTransform(cdRef.value,cdImageRef.value)
        }
    })

    function syncTransform(wrapper,inner){//根据内层的图片的旋转角度，改变外层cd的旋转角度
        const wrapperTransfrom = getComputedStyle(wrapper).transform //外层旋转角度
        const innerTransfrom = getComputedStyle(inner).transform//内层旋转角度
        wrapper.style.transform =wrapperTransfrom === 'none'? innerTransfrom : innerTransfrom.concat('',wrapperTransfrom)
        // 当外层容器没有角度的时候，外层角度就等于内层角度，外层有角度，外层角度原本的角度还要加上内层的角度，用concat叠加一个角度
    }

    return {
        cdRef,
        cdImageRef,
        cdCls
    }
}