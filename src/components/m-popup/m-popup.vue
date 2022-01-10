<template>
  <div class="m-popup" @touchmove.stop.prevent>
    <div class="mask" v-if="mask" :class="{showMask: value}" @click="closePopup"></div>
    <div class="content-wrap" :class="[{show: value, radius}, position]">
      <!-- 头部 -->
      <slot name="title" v-if="$slots.title"/>
      <header v-else @click="$emit('input', !value)">
        <h1 v-if="title">{{title}}</h1>
        <!-- 自定义标题 -->
        <p v-if="confirmText" class="confirm" @click.stop="$emit('confirm')">{{confirmText}}</p>
        <i v-if="showClose" class="iconfont icon-close" @click="$emit('close')"></i>
      </header>
      <main :style="{height: height}">
        <slot/>
      </main>
      <!-- 底部 -->
      <footer v-if="$slots.footer"><slot name='footer'/></footer>
    </div>
  </div>
</template>

<script>
  export default{
    props: {
      value: Boolean,
      height: String,
      confirmText: String,
      showClose: Boolean,
      title: String,
      radius: {
        type: Boolean,
        default: true
      },
      mask: {
        type: Boolean,
        default: true
      },
      position: {
        type: String,
        default: 'bottom'
      }
    },
    computed: {
      isCenter () {
        return this.position === 'center'
      }
    },
    data () {
      return {
      }
    },
    methods: {
      closePopup () {
        if (this.position === 'center') return
        this.$emit('input', !this.value)
      }
    }
  }
</script>
<style lang='scss' scoped>
  
  .m-popup{
    >div{
      position: fixed;
      bottom: var(--window-bottom);
      right: 0;
      left: 0;
      z-index: 99;
    }
    .content-wrap{
      background: #fff;
      box-sizing: border-box;
      transition: all ease .3s;
      z-index: 99;
      padding-top: 0;
      opacity: 0;
      header{
        @extend .y-center;
        justify-content: center;
        height: 98rpx;
        position: relative;
        i,p{
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
        h1{
          font-weight: bold;
          font-size: 32rpx;
          color: #333;
        }
        .confirm{
          font-size: 32rpx;
          color: #666;
          right: 0;
        }
        .icon-close {
          position: absolute;
          right: 30rpx;
          font-size: 44rpx;
          color: #999;
          font-weight: bold;
          &:active{
            opacity: .7;
          }
        }
      }
      main{
        box-sizing: border-box;
        overflow-y: auto;
      }
      // 底部弹窗
      &.bottom {
        transform: translateY(100%);
        &.radius {
          border-radius:30rpx 30rpx 0 0;
        }
        &.show{
          opacity: 1;
          transform: translateY(0);
        }
      }
      // 居中的弹窗
      &.center {
        bottom: 55%;
        left: 80rpx;
        right: 80rpx;
        transform: translateY(50%);
        visibility: hidden;
        &.show {
          opacity: 1;
          visibility: visible;
        }
        &.radius {
          border-radius: 10rpx;
        }
      }
    }
  }
</style>
