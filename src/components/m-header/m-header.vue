<template>
  <!-- 导航栏 -->
  <header
    :style="{
      '--height': height,
      '--left': left,
      '--top': top,
      '--right': right,
      '--background': background
    }"
    :class="{show}">
    <!-- 返回 -->
    <button class="back" v-if="back" @click="toBack"><i class="iconfont icon-left"></i></button>
    <!-- 内容 -->
    <slot/>
  </header>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: true
    },
    back: {
      type: Boolean,
      default: false
    },
    background: {
      type: String,
      default: '#fff'
    }
  },
  data () {
    return {
      height: 0,
      left: 0,
      top: 0,
      right: 0
    }
  },
  mounted () {
    // 导航栏信息
    const { height, left, top, right } = uni.getMenuButtonBoundingClientRect()
    this.height = height + 'px'
    this.left = left + 'px'
    this.top = top + 'px'
    this.right = right + 'px'
    this.$emit('input', {top: this.top})
  },
  methods: {
    toBack () {
      uni.navigateBack()
    }
  }
}
</script>

<style lang='scss' scoped>
  header {
    --margin: calc(100vw - var(--right));
    width: 100vw;
    background: var(--background);
    position: fixed;
    top: 0;
    z-index: 99;
    opacity: 0;
    visibility: hidden;
    transition: opacity ease .25s, visibility ease .25s;
    display: flex;
    align-items: center;
    height: calc(var(--top) + var(--height));
    padding: var(--top) calc(100vw - var(--left)) 0 0;
    .back {
      height: calc(var(--height) - 4rpx);
      width: calc(var(--height) - 4rpx);
      background: rgba(0, 0, 0, 0.15);
      color: #eee;
      border: 1rpx solid #6f6f6f;
      border-radius: 50%;
      font-size: 28rpx;
      font-weight: bold;
      margin-left: var(--margin);
    }
    &.show {
      opacity: 1;
      visibility: visible;
    }
  }
</style>
