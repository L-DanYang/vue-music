<template>
<div class="music-list">
    <!-- 头部 -->
    <div class="back" @click="goBack">
        <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
        <div class="play-btn-wrapper" :style="playbtnStyle">
            <div class="play-btn">
                <i class="icon-play"></i>
                <span class="text">随机播放全部</span>
            </div>
        </div>
        <div class="filter" :style="filterStyle"></div>
    </div>
    <!-- list -->
    <scroll class="list"  :style="scrollStyle" v-loading="loading" v-no-result="noResult" :probeType="3" @scroll="onScroll">
        <div class="song-list-wrapper">
            <song-list :songs="songs"></song-list>
        </div>
    </scroll>
</div>
</template>

<script>
import SongList from '@/components/base/song-list/song-list'
import Scroll from  '@/components/base/scroll/scroll.vue'

const RESERVED_HEIGHT = 40//为滚动预留的距离

export default {
    name:'music-list',
    components:{
        Scroll,
        SongList
    },
    props:{
        songs:{
            type:Array,
            default(){
                return []
            }
        },
        title:String,
        pic:String,
        loading:Boolean,
        noResultText:{
            type:String,
            default:"抱歉，没有找到可播放的歌曲"
        },
    },
    data(){
        return {
            imageHeight:0,//记录图片高度
            scrollY:0,//记录滚动的y值
            maxTranslateY:0,//最大可以滚动的纵坐标的距离
        }
    },
    computed:{
        bgImageStyle(){//背景图片
            const scrollY = this.scrollY
            let zIndex = 0//默认背景层的z-index
            let paddingTop = '70%'
            let height = 0
            let translateZ = 0//ipone 兼容
        

            if(scrollY > this.maxTranslateY){
                zIndex = 10
                paddingTop = 0
                height = `${RESERVED_HEIGHT}px`
                translateZ = 1
            }

            let scale = 1
            if(scrollY < 0){
                scale = 1+Math.abs(scrollY/this.imageHeight)
                // 向下拖动的时候，scrollY小于零，用向下拖动的距离/图片的高度，就可以得到其放大的比例
            }
            return {
                zIndex,
                paddingTop,
                height,
                backgroundImage:`url(${this.pic})`,
                transform:`scale(${scale})translateZ(${translateZ}px)`
            }
        },
        scrollStyle(){//为歌曲列表加上动态的top
            return {
                top:`${this.imageHeight}px`
            }
        },
        filterStyle(){//毛玻璃效果
        // backdropFilter,他的blur属性决定模糊程度，但兼容性很差
            let blur = 0
            const scrollY = this.scrollY
            const imageHeight = this.imageHeight
            if(scrollY>=0){
                blur =Math.min(this.maxTranslateY/imageHeight, scrollY /imageHeight )*20
            }

            return{
                backdropFilter:`blur(${blur}px)`
            }
        },
        playbtnStyle(){//随机播放全部按钮的效果
            let display = ''
            if(this.scrollY >= this.maxTranslateY){
                display = 'none'
            }
            return{
                display
            }
        },
        noResult(){//边界效果处理
            return !this.loading && !this.songs.length
        }
    },
    mounted(){
        this.imageHeight = this.$refs.bgImage.clientHeight
        this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
        // 可以滚动的最大的距离就是，图片的高度，减去预留的高度
    },
    methods:{
        goBack(){
            this.$router.back()
        },
        onScroll(pos){
            this.scrollY = -pos.y
        }
    }
}
</script>

<style lang="scss" scoped>
.music-list {
    position: relative;
    height: 100%;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 20;
      transform: translateZ(2px);
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      z-index: 20;
      transform: translateZ(2px);
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      transform-origin: top;
      background-size: cover;
      .play-btn-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .list {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 0;
      .song-list-wrapper {
        padding: 20px 30px;
        background: $color-background;
      }
    }
  }
</style>