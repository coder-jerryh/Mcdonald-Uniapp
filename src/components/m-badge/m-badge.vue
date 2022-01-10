<template>
  <div class="m-badge">
    <slot/>
    <i :class="[{overNine: count > 9}, size]" v-if="count">{{count}}</i>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'small'
    },
    count: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
    }
  },
  created () {},
  methods: {}
}
</script>

<style lang='scss' scoped>
  .m-badge {
    position: relative;
    i {
      position: absolute;
      right: 0;
      top: -12rpx;
      background: $red;
      color: #fff;
      width: 32rpx;
      height: 32rpx;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 20rpx;
      transform: translate(40%);
      z-index: 10;
      &.overNine {
        border-radius: 100rpx;
        width: auto;
        padding: 0 10rpx;
      }
      &.large {
        width: 34rpx;
        height: 34rpx;
        &.overNine {
          padding: 0 12rpx;
        }
      }
    }
  }
</style>
