import { computed ,ref} from "vue"


export default function useShortcut(props,groupRef){
    const ANCHOR_HEIGHT= 18
    const scrollRef = ref(null)

// 右边导航的内容列表
    const shortcutList = computed(()=>{
        return props.data.map((group)=>{
            return group.title
        })
    })

    const touch ={}

    function onShortcutTouchStart(e){
        // 拿到对应的索引
        const anchorIndex = parseInt(e.target.dataset.index)

        touch.y1 = e.touches[0].pageY
        touch.anchorIndex= anchorIndex

        scrollTo(anchorIndex)   
    }

    function onShortcutTouchMove(e){
        touch.y2 = e.touches[0].pageY
        const delta = (touch.y2-touch.y1)/ANCHOR_HEIGHT | 0  
    
        //touchmove时候的y2 - touchstart时候的Y1/锚点的高度（是固定的18像素）
        // |0 或0 可以理解为正数向下取整的一种简单写法
        const anchorIndex = touch.anchorIndex + delta

        scrollTo(anchorIndex) 
    }

    function scrollTo(index){
        if(isNaN(index)){
            return //因为传进来的e.target还有可能是外面的容器，所以会出现NAN的情况
        }
        // 如果拖拽的时候拖到了外面，就会使delta特别大，所以要对index做约束让其在0到最大index之间
        index = Math.max(0, Math.min(shortcutList.value.length-1 , index))
        const targetEl = groupRef.value.children[index]
        const scroll = scrollRef.value.scroll.scroll._value
        scroll.scrollToElement(targetEl,300)
    }


    return {
        shortcutList,
        scrollRef,
        onShortcutTouchStart,
        onShortcutTouchMove
    }
}