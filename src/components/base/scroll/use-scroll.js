import BScroll from "@better-scroll/core";
import ObserveDOM from '@better-scroll/observe-dom'; //引入observedom
import ObserveImage from "@better-scroll/observe-image";//引入observe-image探测内部图片加载

import { onMounted,onUnmounted ,ref} from "vue";

BScroll.use(ObserveDOM)//注册
BScroll.use(ObserveImage)

export default function useScroll(wrapperRef,options){//扩展一个options参数
    const scroll = ref(null)

    onMounted(()=>{
        // debugger,在此处debugger，这个时候，内容还没有，自然不能滚动
        // betterscroll为我们提供了一个 observe-dom，
        // 之前是数据变化之后执行refresh刷新，现在betterscroll自动探测变化，并刷新
        scroll.value = new BScroll(wrapperRef.value,{
            observeDOM: true, //observeDom 设置为TRUE,做完这一步依旧不能滚动，添加了scrollX，scrollY之后可以滚动
                                // （Google有时可以滚动（可以滚动可能是因为有缓存），Firefox不可以滚动）不知道为什么
            observeImage:true,    //解决滚动问题       
            scrollX:false,
            scrollY:true,
            ...options //扩展运算符添加options
        })
    })

    onUnmounted(()=>{
        scroll.value.destroy()
    })

    return {
        scroll
    }

}