<template>
  <div class="m-swiper"
    :style="{
      '--width': width,
      '--height': height,
      '--radius': radius,
    }">
    <swiper
      class="swiper"
      autoplay
      circular
      :indicator-dots="dotsType == 'point' && list.length > 1"
      indicator-color='#fff'
      indicator-active-color='#FF7321'
      @change="change">
      <swiper-item
        v-for="(item, i) in list" :key="i"
        @click="itemClick(item, i)"
        :style="{
          '--background': background,
          '--padding': padding,
        }">
        <m-image :src='item.url'/>
      </swiper-item>
    </swiper>
    <!-- 数字指示器 -->
    <i class="numberDots" v-if="showDots && point === 'number' && list.length > 1">{{current}}/{{list.length}}</i>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: []
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '750rpx'
    },
    padding: {
      type: String,
      default: '0'
    },
    radius: {
      type: String,
      default: '0'
    },
    dotsType: {
      type: String,
      default: 'point'
    },
    background: {
      type: String,
      default: '#f4f4f4'
    },
    showDots: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      current: 1
    }
  },
  created () {},
  methods: {
    change (e) {
      this.current = e.detail.current + 1
    },
    itemClick (item, i) {
      this.$emit('itemClick', item, i)
    }
  }
}
</script>

<style lang='scss' scoped>
  .m-swiper {
    position: relative;
    padding: var(--padding);
    border-radius: var(--radius);
    overflow: hidden;
    background: #fff;
    .swiper {
      background: var(--background);
      width: var(--width);
      height: var(--height);
      swiper-item {
        /deep/ .m-image {
          background: var(--background);
          padding: var(--padding);
          border-radius: var(--radius);
          width: var(--width);
          height: var(--height);
        }
      }
    }
    .numberDots {
      right: 24rpx;
      bottom: 24rpx;
      height: 42rpx;
      padding: 0 26rpx;
      border-radius: 100rpx;
      background: rgba(0, 0, 0, 0.5);
      @extend .y-center;
      position: absolute;
      font-size: 24rpx;
      color: #fff;
    }
  }
</style>
