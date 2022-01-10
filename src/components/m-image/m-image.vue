<template>
  <div
    class="m-image"
    :class="[
      {showLoading, border},
      `m-image-${index}`
    ]"
    :style="{'--bgColor': bgColor}"
    @click="$emit('click')">
    <img class="placeholder" v-if="!showPic" src="../../assets/images/default.png"/>
    <img
      :show-menu-by-longpress='showMenu'
      :class="{showPic}"
      :mode="mode"
      :src='index === null ? computedUrl() : url'
      lazy-load
      @load='showPic = true'
    />
  </div>
</template>

<script>
export default {
  props: {
    // 图片地址
    src: {
      type: String,
      default () {
        return ''
      }
    },
    // 图片唯一标识，用于懒加载
    index: {
      type: [Number, Object, String],
      default: null
    },
    // 是否展示图片加载中动画
    showLoading: {
      type: Boolean,
      default: false
    },
    // 图片加载前背景色
    bgColor: {
      type: String,
      default: '#F5F7F9'
    },
    // 1px边框
    border: {
      type: Boolean,
      default: false
    },
    // 图片展示方式，同小程序image
    mode: {
      type: String,
      default: 'aspectFill'
    },
    // 长按图片识别小程序码
    showMenu: {
      type: Boolean,
      default: false
    },
    // 距离底部多少距离开始加载图片
    threshold: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      showPic: false,
      url: ''
    }
  },
  computed: {
    // 将threshold从rpx转为px
    getThreshold () {
      // 先取绝对值，因为threshold可能是负数，最后根据this.threshold是正数或者负数，重新还原
      let thresholdPx = uni.upx2px(Math.abs(this.threshold))
      return this.threshold < 0 ? -thresholdPx : thresholdPx
    }
  },
  mounted () {
    // 传了index表示开启图片懒加载
    if (this.index !== null) {
      this.$nextTick(() => {
        // 此uOnReachBottom事件由mixin.js发出，目的是让页面到底时，保证所有图片都进行加载，做到绝对稳定且可靠
        uni.$once('onReachBottom', () => {
          if (!this.url) this.url = this.computedUrl()
        })
        // 这里是组件内获取布局状态，不能用uni.createIntersectionObserver，而必须用this.createIntersectionObserver
        this.disconnectObserver('contentObserver')
        const contentObserver = uni.createIntersectionObserver(this)
        contentObserver.relativeToViewport({
          bottom: this.getThreshold
        }).observe(`.m-image-${this.index}`, res => {
          if (res.intersectionRatio > 0) {
            // 懒加载状态改变
            this.url = this.computedUrl()
            // 如果图片已经加载，去掉监听，减少性能的消耗
            this.disconnectObserver('contentObserver')
          }
        })
        this.contentObserver = contentObserver
      })
    }
  },
  methods: {
    // 获得Url
    computedUrl () {
      if (this.src.includes('http')) {
        return this.src
      } else {
        return this.config.fileUrl + this.src
      }
    },
    // 如果图片已经加载，去掉监听，减少性能的消耗
    disconnectObserver (observerName) {
      const observer = this[observerName]
      observer && observer.disconnect()
    }
  }
}
</script>

<style lang='scss' scoped>
  .m-image{
    background: var(--bgColor);
    font-size: 0;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    &.border {
      @extend .border;
      border-radius: inherit;
      &:after {
        z-index: 3;
        border-radius: inherit;
      }
    }
    image{
      position: relative;
      z-index: 2;
      box-sizing: border-box;
      width: inherit;
      height: 100%;
      border-radius: inherit;
      opacity: 0;
      transition: opacity ease-in-out .2s;
      position: relative;
      &.showPic {
        opacity: 1;
      }
      &.placeholder {
        left: 0;
        opacity: 1;
        width: inherit;
        height: 100%;
        position: absolute;
      }
    }
    &.showLoading::before{
      content: '';
      display: inline-block;
      width: 42rpx;
      height: 42rpx;
      border-radius: 50%;
      border: 1.5px solid #ddd;
      border-top-color: transparent;
      border-right-color: transparent;
      animation: rotating .7s linear infinite;
      position: absolute;
      left: calc(50% - 21rpx);
      top: calc(50% - 21rpx);
      z-index: 1;
    }
  }
</style>
