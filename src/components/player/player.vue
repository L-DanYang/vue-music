<template>
<div class="player" v-show="playlist.length">
    <transition name="normal" 
      @enter = "enter" 
      @after-enter = "afterEnter"
      @leave = "leave"
      @after-leave = "afterLeave">
      <div class="normal-player" v-show="fullScreen">
      <!-- 背景图片 -->
        <div class="background">
            <img :src="currentSong.pic">
        </div>
      <!-- 头部标题 -->
        <div class="top">
            <div class="back" @click="goBack">
                <i class="icon-back"></i>
            </div>
            <h1 class="title">{{currentSong.name}}</h1>
            <h2 class="subtitle">{{currentSong.singer}}</h2>
            <div></div>
        </div>
      <!-- 中间部分 -->
      <div
          class="middle"
          @touchstart.prevent = "onMiddleTouchStart"
          @touchmove.prevent = "onMiddleTouchMove"
          @touchend.prevent = "onMiddleTouchEnd"
      >
          <div
            class="middle-l"
            :style="middleLStyle"
          >
            <div
              class="cd-wrapper"
              ref="cdWrapperRef"
            >
              <div
                class="cd"
                ref="cdRef"
              >
                <img
                  ref="cdImageRef"
                  class="image"
                  :class="cdCls"
                  :src="currentSong.pic">
              </div>
            </div>
            <!-- 当前播放的歌词 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!-- scroll -->
          <scroll 
            class="middle-r"
            :style="middleRStyle"
            ref="lyricScrollRef"
          >
            <div class="lyric-wrapper">
              <!-- ref -->
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{'current': currentLineNum ===index}"
                  v-for="(line,index) in currentLyric.lines"
                  :key="line.num">{{line.txt}}</p>
              </div>
              <!-- 纯音乐没有歌词 -->
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{pureMusicLyric}}</p>
              </div>
            </div>
          </scroll>
       </div>  
        <!-- 底部 -->
        <div class="bottom">
          <!-- 左右层的切换小点 -->
            <div class="dot-wrapper">
              <span class="dot" :class="{'active':currentShow==='cd'}"></span>
              <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
            </div>
          <!-- 播放进度条 -->
            <div class="progress-wrapper">
              <span class="time time-l">{{formatTime(currentTime)}}</span>
              <div class="progress-bar-wrapper">
                <progress-bar 
                ref="barRef"
                :progress="progress" 
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
                >
                </progress-bar>
              </div>
              <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
            </div>
           <!-- 底部的按钮 -->
            <div class="operators">
                <div class="icon i-left">
                    <i :class="modeIcon" @click="changeMode"></i>
                </div>
                <div class="icon i-left" :class="disableCls">
                    <i class="icon-prev" @click="prev"></i>
                </div>
                <div class="icon i-center" :class="disableCls">
                    <i :class="playIcon"  @click="togglePlay"></i>
                </div>
                <div class="icon i-right" :class="disableCls">
                    <i class="icon-next" @click="next"></i>
                </div>
                <div class="icon i-right">
                    <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
                </div>
            </div>
        </div>
      </div>
    </transition>
    <mini-player :progress="progress" :toggle-play="togglePlay"></mini-player>
    <audio ref="audioRef" 
      @pause="pause"
      @canplay="ready" 
      @error="error" 
      @timeupdate="updateTime"
      @ended="end"
    >
    </audio>
</div>
</template>

<script>
import { useStore } from 'vuex'
import { computed ,watch ,ref,nextTick} from 'vue'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import useCD from './use-cd'
import useLyric from './use-lyric'
import useMiddleInteractive from './use-middle-interactive'
import useAnimation from './use-animation'
import ProgressBar from './progress-bar.vue'
import MiniPlayer from './mini-player.vue'
import Scroll from '@/components/base/scroll/scroll.vue'
import {formatTime} from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/constant'



export default {
    name:'player',
    components:{
      ProgressBar,
      MiniPlayer,
      Scroll
    },
    setup(){
        const audioRef = ref(null)
        const barRef = ref(null)
        // 定义的数据
        const songReady = ref(false)//一开始歌曲是没有准备好的
        const currentTime = ref(0)//歌曲的当前播放时长
        let progressChenging = false//记录进度条是否在被修改
        // 从vuex中获取数据
        const store = useStore()
        const fullScreen = computed(()=>store.state.fullScreen)//获取当前屏幕收缩状态
        const currentSong = computed(()=>store.getters.currentSong)//获取当前播放的歌曲
        const playing = computed(()=>store.state.playing)//当前歌曲的播放状态
        const currentIndex = computed(()=>store.state.currentIndex)//当前播放的歌曲的索引值
        const playlist = computed(()=>store.state.playList)//当前播放的歌曲列表
        const playMode = computed(()=>store.state.playMode)//当前歌曲的播放模式

        // 引入的钩子
        const {modeIcon,changeMode} = useMode()//播放顺序按钮 和点击效果 的钩子,
        const {getFavoriteIcon,toggleFavorite} = useFavorite()//喜欢按钮的点击效果和 加入喜欢列表的钩子
        const {cdRef,cdImageRef,cdCls} = useCD()//旋转效果的开始暂停
        const {currentLyric,currentLineNum,playLyric,lyricScrollRef,lyricListRef,stopLyric,pureMusicLyric,playingLyric} = useLyric({songReady,currentTime})//获取歌词数据
        const {currentShow,middleLStyle,middleRStyle,onMiddleTouchStart,onMiddleTouchMove,onMiddleTouchEnd} = useMiddleInteractive()//cd页面和歌词页面的切换效果
        const {cdWrapperRef,enter,afterEnter,leave,afterLeave} = useAnimation()
      



        // 计算属性
        const playIcon = computed(()=>{//动态返回播放和暂停按钮
            return playing.value ? 'icon-pause':'icon-play'
        })

        const disableCls = computed(()=>{//为前进后退和播放的一些无效操作设置样式
          return songReady.value ? '': 'disable'
        })

        const progress = computed(()=>{//歌曲的播放进度，现在播放的时长/歌曲的总时长
          return currentTime.value/currentSong.value.duration
        })

        // watch监听
        watch(currentSong, (newSong)=>{//监听现在要播放的歌曲启动audio

            if(!newSong.id || !newSong.url){
                return //做保护
            }
            // 歌曲发生变化的时候，当前歌曲的播放进度设为0
            currentTime.value = 0
            // 每次歌曲发生变化的时候，歌曲准备状态为false
            songReady.value = false
            const audioEl = audioRef.value
            audioEl.src = newSong.url
            audioEl.play()
            store.commit('setPlayingState', true)
        })
        watch(playing,(newPlaying)=>{//监听开始暂停按钮的点击
            if(!songReady.value){//如果缓存还没有准备好，直接return
              return
            }
            const audioEl = audioRef.value
            if(newPlaying){
              audioEl.play()//歌曲播放开
              playLyric()//歌词滚动开
            }else{
              audioEl.pause()//歌曲播放关
              stopLyric()//歌词滚动关
            }
            // newPlaying ? audioEl.play() : audioEl.pause()
        })
        watch(fullScreen,async (newFullScreen)=>{
          if(newFullScreen){//拿到这个组件，就可以调用组件上的method，等dom变化后才能拿到
            await nextTick()
            barRef.value.setOffset(progress.value)
          }
        })

        // methods
        function goBack(){//歌曲播放视图缩小
            store.commit('setFullScreen',false)
        }

        function togglePlay(){//播放暂停按钮的切换
            if(!songReady.value){//没准备好return
              return
            }
            store.commit('setPlayingState',!playing.value)
        }
        
        function pause(){//当我们audio自己关闭的时候，会让audio暂停，但是不会去修改数据，audio的原生事件可以监听audio的自动关闭
            store.commit('setPlayingState',false)
        }

        function prev(){//后退按钮，上一首
            const list = playlist.value
            if(!songReady.value || !list.length){//边界情况处理，没有数据不做操作||歌曲还没有准备好
                return
            }
            if (list.length === 1){//边界处理，一条数据循环播放
                loop()
            }else{
                let index = currentIndex.value -1 
                // 边界处理如果这首歌已经是第一首，再点击按钮就要回到最后一首歌
                if(index === -1){
                    console.log(list)
                    index = list.length - 1
                    
                }
                store.commit('setCurrentIndex',index)
                // 如果这个歌曲是暂停的状态，点击上一首要让他播放
                if(!playing.value){
                    store.commit('setPlayingState',true)
                }
            }
            
        }

        function next(){//前进按钮，下一首
            const list = playlist.value
            if(!songReady.value || !list.length){//边界情况处理，没有数据不做操作
                return
            }
            if (list.length === 1){
                loop()
            }else{
                let index = currentIndex.value +1 
                // 边界处理如果这首歌已经是第一首，再点击按钮就要回到最后一首歌
                if(index === list.length){
                    index = 0
                }
                store.commit('setCurrentIndex',index)
                // 如果这个歌曲是暂停的状态，点击上一首要让他播放
                if(!playing.value){
                    store.commit('setPlayingState',true)
                }
            }
            
        }

        function loop(){//边界情况如果歌曲列表只有一首歌，那么就要循环播放
            const audioEl = audioRef.value
            audioEl.currentTime = 0
            audioEl.play()
            store.commit('setPlayingState',true)
        }
        
        function ready(){//有一段缓存播放的时候触发这个事件
          if(songReady.value){//如果歌曲已经准备好了就直接return
            return
          }
          songReady.value = true
          playLyric()//播放歌词
        }

        function error(){//歌曲播放错误处理
          songReady.value = true //保证可以前进或者后退
        }

        function updateTime(e){//更改歌曲当前播放时间
          if(!progressChenging){ //在进度条拖动完了，修改完了没有在修改的时候，再开始修改currentTime
            currentTime.value = e.target.currentTime
          }

        }

        function onProgressChanging(progress){//拖动进度条的时候修改currentTime的值
          progressChenging = true
          currentTime.value = currentSong.value.duration * progress
          playLyric()//歌词随进度条同步到响应的位置
          stopLyric()//在定在这里
        }

        function onProgressChanged(progress){//拖动完 真实的修改播放时间
          progressChenging = false
          audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
          if(!playing.value){//拖动完之后如果歌曲是暂停的改为播放
            store.commit('setPlayingState',true)
          }
          playLyric()//拖动好了 歌词随进度条同步到响应的位置
        }

        function end(){//当歌曲播放完毕，根据播放列表播放下一首
          currentTime.value = 0
          if(playMode.value === PLAY_MODE.loop){
            loop()
          }else{
            next()
          }

        }


        return {
            // ref
            audioRef,
            barRef,
            // 定义的数据
            currentTime,
            // vuex中获取的数据
            fullScreen,
            currentSong,
            playlist,
            // computed
            playIcon,
            disableCls,
            progress,
            // methods
            goBack,
            togglePlay,
            pause,
            prev,
            next,
            ready,
            error,
            updateTime,
            onProgressChanging,
            onProgressChanged,
            end,
            // 一些工具函数，在外面定义的
            formatTime,
            // 写在外面的一些钩子
              // 播放顺序设置
            modeIcon,
            changeMode,
              // 喜欢按钮设置
            getFavoriteIcon,
            toggleFavorite,
              // CD播放的一些设置
            cdCls,
            cdRef,
            cdImageRef,
              // 歌词
            currentLyric,
            currentLineNum,
            lyricScrollRef,
            lyricListRef,
            pureMusicLyric,
            playingLyric,
              //两个页面的切换效果
            currentShow,
            middleLStyle,
            middleRStyle,
            onMiddleTouchStart,
            onMiddleTouchMove,
            onMiddleTouchEnd,
              // 大小cd的切换效果
            cdWrapperRef,
            enter,
            afterEnter,
            leave,
            afterLeave
        }
    }
    
}
</script>

<style lang="scss" scoped>
.player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);

        img {
          width: 100%;
          height: 100%;
        }
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
        }
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
        .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          // display:none;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
              .playing {
                animation: rotate 20s linear infinite
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      } 
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 40px;
            line-height: 30px;
            width: 40px;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all .6s;
        .top, .bottom {
          transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
        }
      }
      &.normal-enter-from, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0)
        }
      }

    }
}

</style>