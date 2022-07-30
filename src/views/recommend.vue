<template>
<div class="recommend" v-loading="loading">
    <Scroll class="recommend-content">
        <!-- scroll只对第一个子节点生效所以还需要一层div做包裹 -->
        <div>
        <div class="slider-wrapper">
            <div class="slider-content">
                <silder v-if="sliders.length" :sliders="sliders"></silder>
            </div>
        </div>
        <div class="recommend-list">
            <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
            <ul>
                <li class="item" v-for="item in albums" :key="item.id">
                    <div class="icon">
                        <img v-lazy="item.pic" width="60" height="60">
                    </div>
                    <div class="text">
                        <h2 class="name">{{item.username}}</h2>
                        <p class="title">{{item.title}}</p>
                    </div>
                </li>
            </ul>
        </div>
        </div>
    </Scroll>
</div>
    
</template>

<script>
import { getRecommend } from '@/service/recommend'//获取数据函数
import silder from '@/components/base/slider/silder.vue'//轮播图组件
import Scroll from '@/components/base/scroll/scroll.vue'//滚动组件

export default {
    neme:"recommend",
    // 从发送请求到拿到结果整个过程是一个异步的
    data(){
        return {
            sliders:[],//轮播图数据
            albums:[],//列表数据
            
        }
    },
    components:{
        silder,
        Scroll,
    },
    computed:{
        loading(){
            return !this.sliders.length && !this.albums.length
        }
    },
    async created(){
        const result = await getRecommend()//获取轮播图和列表数据的方法
        this.sliders = result.sliders
        this.albums = result.albums
    }
}
</script>

<style lang="scss" scoped>
.recommend{
    position:fixed;
    width:100%;
    top:88px;
    bottom:0;
    overflow:scroll;
    .recommend-content{
        height:100%;
        overflow: hidden;
        // 写好之后不能滚动，因为容器高度和内容高度一样，所以给容器固定高度，并且overflow：hidden
        // 这个时候依然不能滚动，判断它能不能滚动是在他，new BScroll 的时候也就是初始化的时候，做的一系列的判断
        // 也就是use-scroll 中的onMounted函数中做的判断和计算，计算容器高度和内容高度
        .slider-wrapper{
            position: relative;
            width:100%;
            height:0;
            padding-top:40%;
            overflow:hidden;
            .slider-content{
                position:absolute;
                left:0;
                top:0;
                width:100%;
                height:100%;
            }
        }
        .recommend-list{
            .list-title{
                //热门歌曲推荐
                height:65px;
                line-height:65px;
                text-align:center;
                font-size:$font-size-medium;
                color:$color-theme;
            }
            ul{
                .item{
                    display:flex;
                    align-items:center;
                    box-sizing:border-box;
                    padding:0 20px 20px 20px;
                    .icon{
                        //包裹图片的盒子
                        flex:0 0 60px;
                        width:60px;
                        padding-right: 20px;
                    }
                    .text{
                        //包裹文字的盒子
                        display: flex;
                        flex-direction:column;
                        justify-content:center;
                        flex:1;
                        line-height:20px;
                        overflow:hidden;
                        font-size:$font-size-medium;
                        .name{
                            // 作者名字
                            margin-bottom:10px;
                            color:$color-text;
                        }
                        .title{
                            // 歌曲名字
                            color:$color-text-d;
                        }
                    }
                }
            }
        }
    }
}


</style>