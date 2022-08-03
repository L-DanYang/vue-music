<template>
  <div
    class="progress-bar"
    @click="onClick"
  >
    <div class="bar-inner">
      <!-- 内部的黄色进度条 -->
      <div class="progress" :style="progressStyle" ref="progress"></div>
      <div 
        class="progress-btn-wrapper" 
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16

export default {
    name:'progress-bar',
    props:{
        progress:{//歌曲播放进度 取值范围 0-1
            type:Number,
            default:0
        }
    },
    data(){
        return{
            offset: 0,//偏移量
        }
    },
    computed:{
        progressStyle(){//内部黄色进度条的宽度
            return `width:${this.offset}px`
        },
        btnStyle(){
            return `transform:translate3d(${this.offset}px,0,0)`
        }
    },
    emits:['progress-changing','progress-changed'],
    watch:{
        progress(newProgress){//监听歌曲播放进度，设置进度条的偏移量
            const barWidth = this.$el.clientWidth - progressBtnWidth//进度条的宽度
            this.offset = barWidth *  newProgress
        }
    },
    created(){
      this.touch = {}//为了在函数中共享，不需要观测他的变化，没有必要放在data中，放在data中的数据都会变成响应式，会造成性能的浪费
    },
    methods:{
      onTouchStart(e){
        // 开始点击位置的横坐标
        this.touch.x1 = e.touches[0].pageX
        this.touch.beginWidth = this.$refs.progress.clientWidth //获取进度条的初始宽度

      },
      onTouchMove(e){
        // 相对于初始位置的偏移值
        const delta = e.touches[0].pageX - this.touch.x1
        const tempWidth = this.touch.beginWidth + delta//加上位移之后进度条的宽度
        const barWidth = this.$el.clientWidth - progressBtnWidth//进度条的宽度
        const progress = Math.min(1,Math.max(0,tempWidth/barWidth))//进度条拖动后的宽度，限定在0到1之间
        this.offset = barWidth*progress
        this.$emit('progress-changing',progress)
 
      },
      onTouchEnd(){
        const barWidth = this.$el.clientWidth - progressBtnWidth//进度条的宽度
        const progress = this.$refs.progress.clientWidth/barWidth
        this.$emit('progress-changed',progress)
      },
      onClick(e){
        const rect = this.$el.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        const barWidth = this.$el.clientWidth - progressBtnWidth//进度条的宽度
        const progress = offsetWidth / barWidth
        this.$emit('progress-changed',progress)
      }
    }
}
</script>

<style lang="scss" scoped>
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>