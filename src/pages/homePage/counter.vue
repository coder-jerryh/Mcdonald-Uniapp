<template>
  <div class="counter">
    <!-- 减 -->
    <button class="btn reduce" :disabled='disabled && count == 1' v-if="count || disabled" @click="$emit('reduce')">
      <i class="iconfont icon-reduce"></i>
    </button>
    <!-- 数量 -->
    <i class="count" v-if="count">{{count}}</i>
    <!-- 加 -->
    <button class="btn add" @click="$emit('add')">
      <i class="iconfont icon-add"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang='scss' scoped>
  .counter {
    @extend .y-center;
    height: 40rpx;
    .btn {
      width: 40rpx;
      height: 40rpx;
      background: $yellow;
      padding: 0;
      border-radius: 50%;
      .iconfont {
        font-size: 24rpx;
        color: #000;
        font-weight: bold;
      }
      &.reduce {
        color: #000;
        background: #fff;
        border: 1px solid #666;
      }
      &[disabled] {
        opacity: .2;
      }
    }
    .count {
      width: 50rpx;
      text-align: center;
      font-size: 32rpx;
      color: #222;
      margin: 0 5rpx;
      font-weight: bold;
    }
  }
</style>
