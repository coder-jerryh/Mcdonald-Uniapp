<template>
  <div class="m-checkbox" @click="change">
    <span v-if="label">{{label}}</span>
    <i class="iconfont icon-checkboxs" v-if="value"></i>
    <i class="iconfont icon-checkbox" v-else></i>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
    label: String
  },
  data () {
    return {
    }
  },
  created () {},
  methods: {
    change () {
      this.$emit('input', !this.value)
    }
  }
}
</script>

<style lang='scss' scoped>
  .m-checkbox {
    width: calc(100vw - 100rpx);
    @extend .y-center;
    justify-content: space-between;
    span {
      font-size: 30rpx;
      color: #222;
      margin-right: 10rpx;
    }
    .iconfont {
      font-size: 38rpx;
      color: #999;
      &.icon-checkboxs {
        color: $color;
      }
    }
  }
</style>
