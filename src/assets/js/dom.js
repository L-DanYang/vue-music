// 一些通用的dom操作


// classList.add( newClassName )；添加新的类名，如已经存在，取消添加
// classList.contains( oldClassName );确定元素中是否包含指定的类名，返回值为true 、false；
// classList.remove( oldClassName )；移除已经存在的类名;
// classList.toggle( className )；如果classList中存在给定的值，删除它，否则，添加它；
// classList.replace( oldClassName，newClassName )；类名替换
export function addClass(el,className ){
    if(!el.classList.contains(className)){
        el.classList.add(className)
    }
}

export function removeClass(el,className){
    el.classList.remove(className)
}