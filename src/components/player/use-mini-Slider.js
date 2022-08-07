import { ref ,onMounted,onUnmounted, computed, watch,nextTick} from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default function useMiniSlider(){
    // vuex
    const store = useStore()
    const fullScreen = computed(()=>store.state.fullScreen)
    const playList = computed(()=>store.state.playList)
    const currentIndex = computed(()=>store.state.currentIndex)
    // ref
    const sliderWrapperRef = ref(null)
    console.log(sliderWrapperRef)

    const slider = ref(null)
    // computed
    const sliderShow= computed(()=>{
        return !fullScreen.value && !!playList.value//双非转为布尔型
    })
    

    onMounted(()=>{
        let sliderVal
        watch(sliderShow,async (newSliderShow)=>{//因为mini是v-show来显示和隐藏的，所以在屏幕搜索，并且有歌曲列表的时候才初始化
            if(newSliderShow){
                await nextTick()
                if (!sliderVal){//只有sliderVal初始化的时候才执行这个逻辑，也就是没有
                    sliderVal = slider.value = new BScroll(sliderWrapperRef.value,{
                        click:true,
                        scrollX:true,
                        scrollY:false,
                        momentum:false,
                        bounce:false,
                        probeType:2,
                        slide:{
                            autoplay:false,
                            loop:true
                        }
                    })
                    sliderVal.on('slidePageChanged',({pageX})=>{
                        store.commit('setCurrentIndex',pageX)
                        // store.commit('setPlayingState',true)
                    })
                }else{
                    sliderVal.refresh()
                }  
                sliderVal.goToPage(currentIndex.value,0,0)//横向滚动对应的配置，保证渲染的时候能
            }
        })
        
        watch(currentIndex,(newIndex)=>{
            console.log(currentIndex)
            console.log(newIndex)
            if(sliderVal && sliderShow.value){
                sliderVal.goToPage(currentIndex.value, 0, 0)
            }
        })

    })

    onUnmounted(()=>{
        if(slider.value){
            slider.value.destroy()
        }
    })

    return {
        slider,
        sliderWrapperRef
    }
}