<template>
  <div class="m-radio" :class="{checked: value}" @click="change">
    <i class="iconfont icon-right" v-if="value"></i>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
    readonly: Boolean
  },
  data () {
    return {
    }
  },
  created () {},
  methods: {
    change () {
      if (this.readonly) return
      this.$emit('input', !this.value)
    }
  }
}
</script>

<style lang='scss' scoped>
  .m-radio {
    width: 40rpx;
    height: 40rpx;
    @extend .xy-center;
    border: 1px solid #dcdcdc;
    border-radius: 50%;
    .iconfont {
      font-weight: bold;
      font-size: 28rpx;
    }
    &.checked {
      background: $yellow;
      color: #222;
      border-color: $yellow;
    }
  }
</style>
