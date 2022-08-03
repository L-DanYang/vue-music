//做一些歌曲的永久性存储，比如喜欢列表，比如播放过的歌曲的列表

import storage from "good-storage";

function inertArray(arr ,val,compare,maxLen){//判断这个值是否在arr中
    const index = arr.findIndex(compare)//判断的过程需要用户传过来一个compare
    if (index >-1){
        return
    }
    arr.unshift(val)
    if(maxLen && arr.length > maxLen){//实现最多存储多少首歌曲
        arr.pop()
    }
}

function delateFromArray(arr,compare){//判断这个值是否在这个列表里面，在的话删除 
    const index = arr.findIndex(compare) 
    if(index > -1){
        arr.splice(index,1)
    }
}


export function save(item, key ,compare,maxLen) {//存储过程
    const items = storage.get(key,[])
    inertArray(items,item,compare,maxLen)
    storage.set(key,items)
    return items
}

export function remove(key,compare){//删除的逻辑
    const items = storage.get(key,[])
    delateFromArray(items,compare)
    storage.set(key,items)
    return items
}

export function load(key){//加载读取保存在本地中的歌曲
    return storage.get(key,[])
}