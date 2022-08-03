// 工具函数
export function shuffle(source){//洗牌服务函数
    const arr = source.slice()//定义一个arr保证不会影响到原来的数组
    for (let i=0;i<arr.length;i++){
        const j = getRandomInt(i)
        swap(arr,i,j)
    }
    return arr
}

function getRandomInt(max){//取从0到max的值
    return Math.floor(Math.random()*(max+1))
}

function swap(arr,i,j){//交换arr[i]和arr[j]
    const t =arr[i]
    arr[i]=arr[j]
    arr[j]=t
}

export function formatTime(interval){//做一个事件的格式化
    interval = interval | 0//先向下取整
    const minute = ((interval/60 | 0)+'').padStart(2,'0')//分钟部分,变成字符串，然后不足两位补0
    const second = (interval%60 + '').padStart(2,'0')//秒部分
    return `${minute}:${second}`
}