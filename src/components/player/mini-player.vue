<template>
<transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
        <!-- 旋转小cd -->
        <div class="cd-wrapper">
            <div class="cd" ref="cdRef">
                <img :src="currentSong.pic" width="40" height="40" :class="cdCls" ref="cdImageRef">
            </div>
        </div>
        <!-- 歌名 和歌手名 -->
        <div class="slider-wrapper" ref="sliderWrapperRef">
            <div class="slider-group">
                <div class="slider-page" v-for="song in playList" :key="song.id">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{song.singer}}</p>
                </div>
            </div>
        </div>

        <div class="control" >
            <progress-circle :radius="32" :progress="progress">
                <i class="icon-mini" :class="miniPlayIcon" @click.stop="togglePlay"></i>
            </progress-circle>
        </div>
        <div class="control" @click.stop = "showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      <play-list ref="playlistRef"></play-list>
    </div>
    
</transition>
</template>

<script>
import { useStore } from 'vuex'
import {computed,ref} from 'vue'


import useCD from './use-cd'
import useMiniSlider from './use-mini-Slider'
import progressCircle from './progress-circle.vue'
import playList from './play-list.vue'


export default{
    name:'mini-player',
    components:{
        progressCircle,
        playList
    },
    props:{
        progress:{
            type:Number,
            default:0
        },
        togglePlay:Function
    },
    setup(){
        const playlistRef = ref(null)
        // vuex
        const store = useStore()
        const fullScreen = computed(()=>store.state.fullScreen)
        const currentSong = computed(()=>store.getters.currentSong)
        const playing = computed(()=>store.state.playing)
        const playList = computed(()=>store.state.playList)

        // 自己定义的额钩子
        const {cdCls,cdRef,cdImageRef} = useCD()
        const {sliderWrapperRef} = useMiniSlider()

        const miniPlayIcon = computed(()=>{
              return playing.value ? 'icon-pause-mini':'icon-play-mini'
        })

        function showNormalPlayer(){
            store.commit('setFullScreen',true)
        }
        function showPlaylist(){
          playlistRef.value.show()
        }

        return {
            playlistRef,

            fullScreen,
            currentSong,
            playList,
            // computed
            miniPlayIcon,
            // methods
            showNormalPlayer,
            showPlaylist,
            // cd钩子变量
                // cd
            cdCls,
            cdRef,
            cdImageRef,
                // miniSlider
            sliderWrapperRef,

        }

    }
}

</script>

<style lang="scss" scoped>
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;
    .cd-wrapper {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;
      .cd {
        height: 100%;
        width: 100%;
        img {
          border-radius: 50%;
          &.playing {
            animation: rotate 10s linear infinite;
          }
          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }
    .slider-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        .slider-page {
          display: inline-block;
          width: 100%;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          .name {
            margin-bottom: 2px;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text;
          }
          .desc {
            @include no-wrap();
            font-size: $font-size-small;
            color: $color-text-d;
          }
        }
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-playlist {
        position: relative;
        top: -2px;
        font-size: 28px;
        color: $color-theme-d;
      }
      .icon-mini {
        position: absolute;
        left: 0;
        top: 0;
        color: $color-theme-d;
        font-size: 32px;
      }
    }
    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
    }
    &.mini-enter-from, &.mini-leave-to {
      opacity: 0;
      transform: translate3d(0, 100%, 0)
    }
  }
</style>