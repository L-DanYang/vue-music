<template>
<Scroll class="index-list" :probe-type="3" @scroll="onScroll" ref="scrollRef">
    <ul ref="groupRef">
        <li class="group" v-for="group in data" :key="group.title">
            <h2 class="title">{{group.title}}</h2>
            <ul>
                <li class="item" v-for="item in group.list" :key="item.id" @click="onItemClick(item)">
                    <img v-lazy="item.pic" class="avatar">
                    <span class="name">{{item.name}}</span>
                </li>
            </ul>
        </li>
    </ul>
    <div class="fixed" v-show="fixedTitle" :style="fixedStyle">
        <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div class="shortcut"
        @touchstart.stop.prevent="onShortcutTouchStart"
        @touchmove.stop.prevent="onShortcutTouchMove"
        @touchend.stop.prevent>
        <ul>
            <li class="item" v-for="(item,index) in shortcutList" :key="item" :class="{'current':currentIndex===index}" :data-index="index">
                {{item}}
            </li>
        </ul>
    </div>
</Scroll>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll.vue'
import useFixed from './use-fixed'
import useShortcut from './use-shortcut'

export default {
    name:'index-list',
    components:{
        Scroll,
    },
    emits:['select'],
    props:{
        data:{
            type:Array,
            default(){
                return []
            }
        }
    },
    setup(props,{emit}){
        const {groupRef,onScroll,fixedTitle,fixedStyle,currentIndex} =  useFixed(props)
        const {shortcutList,scrollRef,onShortcutTouchStart,onShortcutTouchMove} = useShortcut(props,groupRef)

        function onItemClick(item){
            emit('select',item)
        }

        return {
            groupRef,
            onScroll,
            fixedTitle,
            fixedStyle,
            currentIndex,

            shortcutList,
            scrollRef,
            onShortcutTouchStart,
            onShortcutTouchMove,

            onItemClick
        }
    }
}
</script>

<style lang="scss" scoped>
.index-list{
    // scroll组件
    position:relative;
    width:100%;
    height:100%;
    overflow: hidden;
    background:$color-background;
    .group{
        // 第一层ul的li
        padding-bottom:30px;
        .title{
            // 第一层li的小标题
            height:30px;
            line-height:30px;
            padding-left:20px;
            font-size:$font-size-small;
            color:$color-text-l;
            background:$color-highlight-background;
        }
        .item{
            // 第二层ul的li
            display:flex;
            align-items:center;
            padding:20px 0 0 30px;
            .avatar{
                // 第二层li的图片
                width:50px;
                height:50px;
                border-radius:50%;
            }
            .name{
                // 第二层li的明星姓名
                margin-left:20px;
                color:$color-text-l;
                font-size:$font-size-medium;
            }
        }
    }

    // 层
    .fixed{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        .fixed-title{
            height:30px;
            line-height:30px;
            padding-left:20px;
            font-size:$font-size-small;
            color:$color-text-l;
            background:$color-highlight-background;
        }
    }

    .shortcut{
        position:absolute;
        right:4px;
        top:50%;
        transform: translateY(-50%);
        width:20px;
        padding:20px 0;
        border-radius:10px;
        text-align: center;
        background: $color-background-d;
        font-family: Helvetica;
        .item{
            padding:3px;
            line-height:1;
            color:$color-text-l;
            font-size:$font-size-small;
            &.current{
                color:$color-theme
            }
        }
    }
    
}

</style>