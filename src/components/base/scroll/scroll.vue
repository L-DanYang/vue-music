<template>
<div ref="rootRef">
    <slot></slot>
</div>
</template>

<script>
import useScroll from './use-scroll'
import { ref } from 'vue'

export default {
    name:'scroll',
    props:{//想让组件有默认行为
        click:{//想把click传递给初始化scroll的options，可以给useScroll添加一个参数
            type:Boolean,
            default:true
        },
        probeType:{
            type:Number,
            default:0
        }
    },
    emits:['scroll'],
    setup(props,{emit}){//外部使用的时候，把props传递过去就行
        const rootRef = ref(null)
        const scroll=useScroll(rootRef,props,emit)//setup带了props，里面的useScroll就可以拿到props

        return {
            rootRef,
            scroll
        }
    }
}
</script>

<style lang="scss" scoped>

</style>