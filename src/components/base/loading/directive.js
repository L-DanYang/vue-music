import Loading from './loading'
import createLoadingLikeDirective  from '@/assets/js/create-loading-like-directive'

const loadingDirective = createLoadingLikeDirective(Loading)

export default loadingDirective



// // 创建一个指令对象
// // 开发自定义指令
// import { createApp } from 'vue'
// import loading from './loading'
// import { addClass,removeClass } from '@/assets/js/dom'

// const relativeCls = 'g-relative'//g-relative 在base.scss中已经定义

// const loadingDirective = {
//     mounted(el,binding){
//         const app = createApp(loading) //创建一个app实例,loading实例对应的这个dom对象他要挂载到el上
//         const instance = app.mount(document.createElement('div'))//动态创建一个div
//         el.instance = instance;//把instance保留到el上
        
//         // const title = binding.arg
//         // if (typeof title !== 'undefined'){
//         //     instance.setTitle(title)
//         // }

//         if(binding.value){
//             append(el)
//         }

//     },
//     updated(el,binding){
//         // const title = binding.arg
//         // if (typeof title !== 'undefined'){
//         //     instance.setTitle(title)
//         // }
//         if(binding.value !== binding.oldValue){
//             binding.value?append(el):remove(el)
//         }
//     }
// }


// function append(el){
//     // 执行挂载
//     const style = getComputedStyle(el)//动态拿到el的样式
//     // loading组件用的定位方式是absolute这就要求他的父组件必须是定位
//     // 判断position是不是一下的三种定位之一
//     if(['absolute','fixed','relative'].indexOf(style.position)=== -1){ 
//         addClass(el, relativeCls)// 添加样式
//     }
//     el.appendChild(el.instance.$el)
//     // el.instance就是loading组件的实例，他的$el对象就是loading组件对应的dom对象

// }

// function remove(el){
//     removeClass(el,relativeCls)
//     el.removeChild(el.instance.$el)
// }

// export default loadingDirective

