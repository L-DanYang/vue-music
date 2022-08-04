import { ref} from 'vue'

export default function useMiddleInteractive(){
    const currentShow = ref('cd')
    const middleLStyle = ref(null)
    const middleRStyle = ref(null)

    const touch = {}
    let currentView = 'cd'

    function onMiddleTouchStart(e){
        touch.startX = e.touches[0].pageX//初始的x值
        touch.startY = e.touches[0].pageY//记录初始的Y值
        touch.directionLocked = ''//方向锁

    }

    function onMiddleTouchMove(e){
        const deltaX = e.touches[0].pageX - touch.startX//偏移量
        const deltaY = e.touches[0].pageY - touch.startY//得到Y的偏移量

        // 取绝对值
        const absDeltaX = Math.abs(deltaX)
        const absDeltaY = Math.abs(deltaY)

        if (!touch.directionLocked){//如果方向锁为空，为方向锁赋值：X的绝对值大于等于Y的，认为横向滚动否则为纵向滚动
            touch.directionLocked = absDeltaX >= absDeltaY ? 'h' :'v'
        }
        if (touch.directionLocked === 'v'){//如果为纵向滚动，就什么都不做，直接return
            return
        }

        const left = currentView === 'cd' ? 0 : -window.innerWidth//当前视图的页面时不是cd页面，是的话left为零不是的话left是一个负的屏幕宽度
        const offsetWidth =Math.min(0,Math.max(-window.innerWidth,left + deltaX )) //歌词列表层的偏移量,偏移量要做一个限制，在0 到 屏幕的宽度之间
        touch.percent = Math.abs(offsetWidth / window.innerWidth)//算出一个偏移比例保存到touch上
        if(currentView === 'cd'){
            if(touch.percent >0.2){
                currentShow.value="lyric"
            }else{
                currentShow.value="cd"
            }
        }else{
            if(touch.percent < 0.8){
                currentShow.value="cd"
            }else{
                currentShow.value="lyric"
            }
        }

        middleLStyle.value={
            opacity: 1 - touch.percent,
            transitionDuration:'0ms'//这里不设置也是OK的
        }

        middleRStyle.value={
            transform:`translate3d(${offsetWidth}px,0,0)`,
            transitionDuration:'0ms'//这里不设置也是OK的
        }

       
    }
     
    function onMiddleTouchEnd(){
        let offsetWidth
        let opacity
        if(currentShow.value === 'cd'){
            currentView = "cd"
            offsetWidth = 0
            opacity = 1
        }else{
            currentView = "lyric"
            offsetWidth = -window.innerWidth
            opacity = 0
        }

        const duration = 300
        middleLStyle.value={
            opacity,
            transitionDuration:`${duration}ms`
        }

        middleRStyle.value={
            transform:`translate3d(${offsetWidth}px,0,0)`,
            transitionDuration:`${duration}ms`
        }


    }

    return{
        currentShow,
        middleLStyle,
        middleRStyle,
        onMiddleTouchStart,
        onMiddleTouchMove,
        onMiddleTouchEnd
    }
}