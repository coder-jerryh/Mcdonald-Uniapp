<template>
  <div class="m-scroll">
    <!-- 下拉刷新 -->
    <div class="loading pullLoading" :class="{loadingTime}" v-if="!nativePullLoading">
      <i class="dot"></i>
    </div>
    <!-- 内容插槽 -->
    <slot/>
    <!-- 上拉加载 -->
    <div v-if="showLoading" class="loading">
      <i class="dot"></i>
    </div>
    <!-- 空布局 -->
    <div class="empty" v-if='isEmpty' :style="{height: emptyHeight}">
      <!-- 自己更换图片哟 -->
      <img src="./empty.png">
      <button v-if="showLogin" @click="$toUrl('/pages/login/index')">去登录</button>
      <p v-else>暂无数据~</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true,
      default () {
        return {
          // 当前页码
          page: 1,
          // 每页条数
          pageSize: 10,
          // 是否有下一页
          hasNextPage: false,
          // 数据总数
          total: 0
        }
      }
    },
    emptyHeight: {
      type: String,
      default: '80vh'
    },
    // 原生下拉刷新动画
    nativePullLoading: Boolean
  },
  data () {
    return {
      // 加载动画
      showLoading: true,
      // 无数据
      isEmpty: false,
      // 加载中
      isLoading: false,
      // 需要长时间动画
      loadingTime: false,
      // 去登录
      showLogin: false
    }
  },
  computed: {
    // 转换一下pages
    pages () {
      return this.value
    }
  },
  methods: {
    // 手滑动下拉刷新
    pullRefresh (loadingTime = false) {
      // 加载中
      this.isLoading = true
      // 关闭动画
      this.showLoading = false
      // 隐藏空数据
      this.isEmpty = false
      // 加载时间
      this.loadingTime = loadingTime ? 800 : 0
      this.$emit('input', {...this.pages, page: 1})
      this.$emit('getData')
    },
    // 上拉加载
    loadMore () {
      // 无下一页或加载中不加载
      if (!this.showLoading || this.isLoading) return
      // 加载中
      this.isLoading = true
      this.$emit('input', {...this.pages, page: this.pages.page + 1})
      this.$emit('getData')
    },
    // 加载成功
    loadSuccess (data) {
      this.showLogin = false
      // 结束下拉刷新
      uni.stopPullDownRefresh()
      // 是否有下一页（可根据总页数和当前页数判断）
      this.showLoading = data.hasNextPage
      const timer = setTimeout(() => {
        // 是否有数据
        this.isEmpty = !data.total
        // 关闭加载中
        this.isLoading = false
        this.loadingTime = 0
        clearTimeout(timer)
      }, this.loadingTime)
    },
    // 主动刷新
    refresh (time = 150) {
      this.showLoading = true
      // 隐藏空数据
      this.isEmpty = false
      const timer = setTimeout(() => {
        this.$emit('input', {...this.pages, page: 1})
        this.$emit('getData')
        clearTimeout(timer)
      }, time)
    },
    noLogin () {
      this.showLoading = false
      this.isEmpty = true
      this.showLogin = true
    }
  }
}
</script>

<style lang='scss' scoped>
  // 加载中动画
  @keyframes dotFlashing {
    0% {
      background-color: #ccc;
    }
    100% {
      background-color: #999;
    }
  }
  .m-scroll{
    // loading
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100rpx;
      overflow: hidden;
      transition: all ease .3s;
      &.pullLoading{
        // 这里是关键
        margin-top: -100rpx;
        &.loadingTime {
          margin: 0;
        }
      }
      // 模拟微信小圆点
      .dot {
        display: inline-block;
        position: relative;
        width: 14rpx;
        height: 14rpx;
        border-radius: 50%;
        background: #999;
        animation: dotFlashing 1s infinite linear alternate;
        animation-delay: .5s;
        &::before {
          left: -28rpx;
          animation: dotFlashing 1s infinite alternate;
          animation-delay: 0s;
        }
        &::after {
          left: 28rpx;
          animation: dotFlashing 1s infinite alternate;
          animation-delay: 1s;
        }
        &::before,
        &::after {
          content: '';
          display: inline-block;
          position: absolute;
          top: 0;
          width: 14rpx;
          height: 14rpx;
          border-radius: 50%;
          background: #999;
        }
      }
    }
    // 空布局
    .empty{
      @extend .xy-center;
      img{
        width: 329rpx;
        height: 240rpx;
        zoom: .8;
      }
      p{
        margin-top: 30rpx;
        color: #999;
        font-size: 26rpx
      }
    }

    // 去登录
    button {
      width: 200rpx;
      height: 68rpx;
      color: $color;
      border: 1px solid;
      margin-top: 30rpx;
      font-size: 28rpx;
      background: #fff;
    }
  }
</style>