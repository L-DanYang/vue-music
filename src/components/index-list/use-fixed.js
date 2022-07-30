import {ref, watch,nextTick, computed} from 'vue'

export default function useFixed(props){
    const TITLE_HEIGHT =30 //fixedtitle这个层的高度
    const groupRef = ref(null)
    const listHeights = ref([])//定义一个数组，记录每组的高度
    const scrollY = ref(0)//纵向的值
    const currentIndex = ref(0)//当前的展示组的索引
    const distance = ref(0)//当前组的下一个组他距离容器顶部的距离

    const fixedTitle= computed(()=>{
        if(scrollY.value<0){
            return ''
        }//当scrollY小于0 的时候我们不希望上面依旧有fixedtitle
        const currentGroup = props.data[currentIndex.value]
        return currentGroup? currentGroup.title : ''
    })

    const fixedStyle = computed(()=>{
        const diff=(distance.value >0 && distance.value<TITLE_HEIGHT) ? distance.value - TITLE_HEIGHT : 0
        return {
            transform:`translate3d(0,${diff}px,0)`
        }

    })

    // 当数据变化的时候就会触发这个函数所以需要传进来一个props
    watch(()=>props.data, async ()=>{
        await nextTick()
        calculate()
    })

    watch(scrollY,(newY)=>{//监听Y值变化 拿到每一组的顶部的值和底部的值，判断是不是在这个区间，然后将当前区间的索引值返回出去
        for(let i=0;i<listHeights.value.length-1;i++){
            const heightTop = listHeights.value[i]
            const heightBottom = listHeights.value[i+1]
            if(newY>=heightTop && newY<=heightBottom){
                currentIndex.value = i
                distance.value = heightBottom - newY//下一个组的底部和容器的距离
            }
        }
    })

    function calculate(){//计算列表每个区间的高度
        // 求解列表的高度，拿到组的dom,获取他的chlidren 
        const list = groupRef.value.children
        listHeights.value.length = 0 //初始化
        let height = 0 //初始一个高度
        listHeights.value.push(height)

        for(let i=0 ;i<list.length; i++){
            height +=list[i].clientHeight //拿到每个区间的累加值
            listHeights.value.push(height)
        }

    

    }


    function onScroll(pos){
        scrollY.value = -pos.y
    }


    return {
        groupRef,
        onScroll,
        fixedTitle,
        fixedStyle,
        currentIndex
    }
}