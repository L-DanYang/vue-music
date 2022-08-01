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