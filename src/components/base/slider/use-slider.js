// 引入核心滚动以及slide
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import {onMounted,onUnmounted,ref} from 'vue'

// 注册slide组件
BScroll.use(Slide)

// 抛出一个useslider function
export default function useSlider(wrapperRef){
    const slider = ref(null)//初始化一个slider
    const currentPageIndex = ref(0)//初始化一个currentPageIndex

    onMounted(()=>{//mounted时 初始化slider
        slider.value = new BScroll(wrapperRef.value,{
            scrollX:true,
            scrollY:false,
            bounce:false,
            probeType:2,
            momentum:false,
            click:true,
            slide:true
        })
        // slide的currentPage的值要改变的时候会触发，slidePageChanged事件，从而获得一个对象page， 
        // page 的pageX就是即将展示的横向页面的索引值，下标从0开始
        slider.value.on('slidePageChanged',(page)=>{
            currentPageIndex.value = page.pageX
        })
    })

    // unmounted时销毁
    onUnmounted(()=>{
        slider.value.destroy()//销毁
    })
    // return出去
    return {
        slider,
        currentPageIndex
    }

}

