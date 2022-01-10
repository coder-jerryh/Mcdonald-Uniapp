<template>
  <video
    class='m-video'
    id='m-video'
    :class="[{showVideo, selfPay: hiddenControl, pause}, size]"
    :src="url"
    lazy-load
    :object-fit='objectFit'
    :show-fullscreen-btn='fullScreen'
    @loadedmetadata='loadSuccess'
    :show-center-play-btn='fullScreen'
    :show-progress='fullScreen'
    :controls='false'
    :muted='muted'
    @click.stop="clickVideo"
    @play='play'
    @ended='end'
    :autoplay='autoplay'
    :loop='loop'
    :enable-progress-gesture='false'
    @fullscreenchange='fullscreenchange'
    :direction='0'
  ><span v-if="!fullScreen" class="duration">{{duration}}</span></video>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default () {
        return ''
      }
    },
    hiddenControl: Boolean,
    size: {
      type: String,
      default () {
        return 'middle'
      }
    },
    autoplay: Boolean,
    // 静音
    muted: Boolean,
    loop: Boolean
  },
  data () {
    return {
      pause: true,
      duration: 0,
      initialTime: 0,
      objectFit: 'aspectFill',
      showVideo: false,
      videoCtx: null
    }
  },
  computed: {
    url () {
      if (this.src.includes('http')) {
        return this.src
      } else {
        return this.config.fileUrl + this.src
      }
    }
  },
  created () {
    this.videoCtx = wx.createVideoContext('m-video', this)
  },
  methods: {
    play () {
      this.pause = false
      this.objectFit = 'contain'
    },
    end () {
      this.pause = true
    },
    clickVideo () {
      this.$toUrl(`/pages/common/videoDetail?src=${this.url}`)
    },
    loadSuccess (e) {
      this.duration = this.$dateFilter(Math.round(e.detail.duration) * 1000, 'mm:ss')
      this.$emit('update:duration', Math.round(e.detail.duration) * 1000)
      this.showVideo = true
    },
    fullscreenchange (e) {
      this.fullScreen = e.detail.fullScreen
      if (!e.detail.fullScreen) {
        this.initialTime = e.timeStamp
        // 执行全屏方法
        this.videoCtx.pause()
        this.objectFit = 'cover'
      }
    },
    triggerPause () {
      this.pause = true
      this.videoCtx.pause()
    }
  }
}
</script>

<style lang='scss' scoped>
  .m-video{
    background: #F5F7F9;
    opacity: 0;
    transition: opacity ease-in-out .3s;
    font-size: 0;
    &.showVideo {
      opacity: 1;
    }
    // &::before{
    //   border: 1rpx solid $border;
    //   position: absolute;
    //   left: 0;
    //   top: 0;
    //   right: 0;
    //   bottom: 0;
    //   content: '';
    //   z-index: 1;
    //   border-radius: 10rpx;
    // }
    &.pause::after{
      font-family: "iconfont";
      content: "\e66e";
      position: absolute;
      display: inline-block;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: #eee;
    }
    &.mini::after{
      font-size: 40rpx;
    }
    &.middle::after{
      font-size: 60rpx;
    }
    &.large::after{
      font-size: 70rpx;
    }
    span{
      position: absolute;
      right: 20rpx;
      bottom: 30rpx;
      color: #fff;
      z-index: 10;
    }
  }
</style>
