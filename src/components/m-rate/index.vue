<template>
  <div class="m-rate">
    <li v-for="(item, i) in rateList" :key="i" @click="change(i)" :style="{'--size': `${size}rpx`}">
      <i v-if="imgs[item] !== 'icon-half-star'" class="iconfont" :class="imgs[item]"></i>
      <!-- 半星 -->
      <div v-else class="half">
        <i class="iconfont icon-off-star"></i>
        <i class="iconfont icon-half-star"></i>
      </div>
    </li>
  </div>
</template>

<script>
export default {
  props: {
    // 分值
    value: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 34
    }
  },
  data () {
    return {
      imgs: {
        on: 'icon-on-star',
        off: 'icon-off-star',
        half: 'icon-half-star'
      }
    }
  },
  computed: {
    rateList () {
      let rateList = []
      for (let i = 0; i < parseInt(this.value); i++) {
        rateList.push('on')
      }
      if (String(this.value).includes('.')) {
        rateList.push('half')
      }
      const len = 5 - rateList.length
      for (let i = 0; i < len; i++) {
        rateList.push('off')
      }
      return rateList
    }
  },
  methods: {
    change (i) {
      if (this.disabled) return
      this.$emit('input', i + 1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .m-rate {
    font-size: 0;
    @extend .y-center;
    li {
      position: relative;
      top: -2rpx;
      &+li {
        margin-left: 6rpx;
      }
      .iconfont {
        font-size: var(--size);
      }
      .icon-on-star,.icon-half-star{
        color: #FF7321;
      }
      .icon-off-star{
        color: #ddd;
      }
      .half{
        @extend .y-center;
        position: relative;
        .icon-half-star{
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }
  }
</style>
