<template>
  <!-- 广告区域 -->
  <div class="banner">
    <swiper :style="{height, marginBottom: bannerBottom}" autoplay circular @change='change'>
      <swiper-item v-for="url in list" :key="url">
        <img :src="url" mode='aspectFill'>
      </swiper-item>
    </swiper>
    <ul class="point">
      <li v-for="(item, i) in list" :key="i" :class="{active: current == i}"></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: '100%'
    },
    list: {
      type: Array,
      default: () => []
    },
    bannerBottom: {
      type: String,
      default: '0'
    }
  },
  data () {
    return {
      current: 0
    }
  },
  methods: {
    change (e) {
      this.current = e.detail.current
    }
  }
}
</script>

<style lang='scss' scoped>
  .banner {
    position: relative;
    swiper {
      width: 100vw;
      img {
        width: 100%;
        height: 100%;
      }
    }
    ul {
      position: absolute;
      bottom: 70rpx;
      right: 20rpx;
      display: flex;
      li {
        margin: 0 5rpx;
        width: 12rpx;
        height: 12rpx;
        background: #fff;
        border-radius: 100rpx;
        transition: all ease .25s;
        &.active {
          width: 30rpx;
          background: $yellow;
        }
      }
    }
  }
</style>
