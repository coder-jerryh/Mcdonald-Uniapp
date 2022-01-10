<template>
  <div class="container">
    <!-- 导航栏 -->
    <m-header :show='showNav'>
      <nav v-if="showNav">
        <i class="iconfont icon-search"></i>
        <input placeholder="请输入关键字">
      </nav>
    </m-header>
    <!-- 滚动区域 -->
    <scroll-view scroll-y @scroll='pageScroll' :scrollTop='scrollTop' scroll-anchoring enable-back-to-top>
      <div>
        <!-- 广告区域 -->
        <banner :height="bannerHeight" :bannerBottom='bannerBottom' :list="bannerList"/>
        <!-- 吸顶区域 -->
        <div class="sticky" :style="{top: parseInt(navFullHeight) - 8 + 'px'}">
          <i class="bar" :style="{opacity: Number(!showNav)}"></i>
          <div class="storeInfo">
            <div class="left">
              <span class="address">{{address}}</span>
              <p class="distance">
                <img src="../../assets/images/house.png">
                <span>到店取餐</span>
                <span>｜距离425m</span>
              </p>
            </div>
            <div class="card" @click="changeMenu">
              <img src="../../assets/images/card.png">
              <span>{{menuType == 1 ? '正餐' : '早餐'}}</span>
            </div>
          </div>
        </div>
        <!-- 主内容区域 -->
        <main>
          <!-- 左侧分类 -->
          <scroll-view scroll-y class="leftSide" :style="{height: `calc(100vh - ${stickyHeight})`,top: stickyHeight}" :scroll-into-view="'classifyId' + classifyId">
            <ul>
              <li @click="changeClassify(i)" v-for="(item, i) in data" :key="i" :id="'classifyId' + i" :class="{active: i == classifyId}">
                <m-image :src='item.image'/>
                <h3 v-html="item.categoryName"></h3>
                <i class="new" v-if="item.categoryTags.length">{{item.categoryTags[0]}}</i>
              </li>
              <li class="block" :id="`block${classifyId}`" :style="{top: classifyId * $computedRpx(160) + 'px'}"></li>
            </ul>
          </scroll-view>
          <!-- 右侧餐品 -->
          <ul class="rightSide">
            <li v-for="(item, index) in data" :key="index" class="item">
              <h1>{{formatName(item.categoryName)}}</h1>
              <div class="tabs">
                <span>佳节新品</span>
                <span>经典特惠</span>
              </div>
              <ul class="list">
                <!-- 餐品 -->
                <dish-item :ref='`dishItem${dish.productCode}`' v-for="(dish, i) in item.productList" :key="i" :item='dish' :codeCountOption='codeCountOption' @changeDish='changeDish'/>
              </ul>
            </li>
          </ul>
        </main>
      </div>
    </scroll-view>
    <!-- 底部 -->
    <footer>
      <div>
        <m-badge :count='totalCount'>
          <img @click="showPopup = cartList.length > 0" class="cart" id="cart" src="../../assets/images/cart.png">
        </m-badge>
        <span v-if="totalCount" class="totalPrice">¥{{totalPrice}}</span>
        <span v-else class="noDish">未选购餐品</span>
        <button :disabled='!totalCount'>去结算</button>
      </div>
    </footer>
    <!-- 飞入购物车 -->
    <fly-in-cart ref='flyInCart'/>
    <!-- 弹窗 -->
    <m-popup v-model="showPopup">
      <header slot='title'>
        <h1>餐品详情</h1>
        <span @click="clearCart"><i class="iconfont icon-delete"></i>清空购物车</span>
      </header>
      <scroll-view scroll-y>
        <ul>
          <dish-item v-for="(dish, i) in cartList" :key="i" :item='dish' :codeCountOption='codeCountOption' @changeDish='changeDish' isCartItem/>
        </ul>
      </scroll-view>
    </m-popup>
  </div>
</template>

<script>
import dishItem from './dish-item.vue'
import banner from './banner.vue'
import {Breakfast, Dinner, bannerList} from './data'
import flyInCart from './fly-in-cart.vue'
import {getLocation} from '../../utils/method'
export default {
  components: {
    banner,
    dishItem,
    flyInCart
  },
  data () {
    return {
      /** @nav **/
      navFullHeight: 0,
      showNav: false,
      /** @数据 **/
      data: Dinner,
      Dinner,
      bannerList,
      menuType: 1,
      /** @banner **/
      bannerHeight: '240px',
      bannerBottom: '-25px',
      /** @购物车坐标 **/
      cartRect: {},
      /** @变量 **/
      address: '加载中…',
      scrollTop: 0,
      classifyId: 0,
      productId: 0,
      stickyHeight: 0,
      heightArr: [],
      /** @已添加餐品 **/
      codeCountOption: {},
      totalCount: 0,
      totalPrice: 0,
      showPopup: false,
      cartList: []
    }
  },
  watch: {
    cartList: {
      handler () {
        let codeCountOption = {}
        let totalCount = 0
        let totalPrice = 0
        this.cartList.forEach(item => {
          codeCountOption[item.productCode] = item.count
          totalCount += item.count
          totalPrice += item.count * item.priceInfo.deliveryPriceText
        })
        this.codeCountOption = {...codeCountOption}
        this.totalCount = totalCount
        this.totalPrice = totalPrice.toFixed(1)
        uni.setStorageSync('cartList', this.cartList)
      },
      deep: true
    }
  },
  onShareAppMessage () {
    return {
      title: `Jerry邀请你看看他的小程序`
    }
  },
  created () {
    // 清除要加入购物车的套餐
    uni.removeStorageSync('addCartCombo')
    // 获取地址
    getLocation().then(res => {
      this.address = res.formatted_addresses.rough
    })
    // 读取购物车缓存
    this.cartList = uni.getStorageSync('cartList') || []
  },
  mounted () {
    // 计算Dom
    this.computedDom()
  },
  onShow () {
    const comboDetail = uni.getStorageSync('addCartCombo')
    if (comboDetail) {
      uni.removeStorageSync('addCartCombo')
      for (let item of this.data) {
        for (let dish of item.productList) {
          if (dish.productCode === comboDetail.productCode) {
            this.$nextTick(() => {
              console.log(comboDetail.count)
              this.$refs[`dishItem${dish.productCode}`][0].addDish(dish, comboDetail.count)
            })
            return
          }
        }
      }
    }
  },
  methods: {
    // 切换分类
    changeClassify (id) {
      this.classifyId = id
      if (id < 1) {
        this.scrollTop = 0
      } else {
        this.scrollTop = this.heightArr[id - 1]
      }
    },
    // 滑动产品
    pageScroll ({detail}) {
      const {scrollTop} = detail
      if (scrollTop < 0) return

      // 设置标题栏显隐和颜色
      this.showNav = scrollTop >= parseInt(this.bannerHeight) - parseInt(this.navFullHeight) - 25
      uni.setNavigationBarColor({
        frontColor: this.showNav ? '#000000' : '#ffffff',
        backgroundColor: this.showNav ? '#ffffff' : '#000000'
      })

      // 动态选中左侧分类
      const {heightArr} = this
      for (let i = 0; i < heightArr.length; i++) {
        if (i === 0 && scrollTop < heightArr[0]) {
          this.classifyId = 0
        } else if (i > 0 && scrollTop >= heightArr[i - 1] && scrollTop < heightArr[i]) {
          this.classifyId = i
        }
      }
    },
    // 添加餐品
    changeDish (rect, currentDish, count) {
      return new Promise(resolve => {
        // 弹窗打开的时候不需要动画
        if (count > 0 && !this.showPopup) {
          this.$refs.flyInCart.addToCart({
            id: currentDish.productCode,
            url: currentDish.productImage,
            startRect: {
              x: rect.left + 30, // 起始位置右移30
              y: rect.top - 10 // 起始位置上移10
            },
            endRect: {
              x: this.cartRect.left - 5, // 结束位置左移5
              y: this.cartRect.top + 5 // 结束位置下移5
            },
            complete: () => {
              resolve()
            }
          })
        } else {
          resolve()
        }
      }).then(() => {
        // 在购物车中查找当前餐品
        const dishIndex = this.cartList.findIndex(item => {
          return JSON.stringify({...item, count: 0}) === JSON.stringify({...currentDish, count: 0})
        })
        // 添加过
        if (dishIndex > -1) {
          this.cartList[dishIndex].count += count
          // 删完无数量了要把当前餐品从购物车移除
          if (!this.cartList[dishIndex].count) {
            this.cartList.splice(dishIndex, 1)
          }
        } else {
          // 否则新增餐品
          this.cartList.push({...currentDish, count})
        }
        if (!this.cartList.length) {
          this.showPopup = false
        }
      })
    },
    // 清空购物车🛒
    clearCart () {
      this.$Confirm(
        '提示',
        '确定是否清空购物车？',
        '确认',
        () => {
          this.showPopup = false
          this.cartList = []
        }
      )
    },
    // 切换
    changeMenu () {
      const that = this
      uni.showActionSheet({
        itemList: ['早餐', '正餐'],
        success ({tapIndex}) {
          that.classifyId = 0
          that.data = []
          that.menuType = tapIndex
          that.$nextTick(() => {
            that.data = {0: Breakfast, 1: Dinner}[tapIndex]
            that.scrollTop = 0.01
          })
        }
      })
    },
    computedDom () {
      this.$nextTick(() => {
        const {top, height} = uni.getMenuButtonBoundingClientRect()
        this.navFullHeight = top + height + 'px'
        // 计算出导航栏+吸顶区域高度
        this.$('.sticky').then(([stickyDom]) => {
          if (stickyDom) {
            this.stickyHeight = `calc(${this.navFullHeight} + ${stickyDom.height + 'px'})`
          }
        })

        // 计算出右侧各分类下产品高度
        this.$('.item').then(itemList => {
        // 初识高度 = 轮播图高度 - 导航栏高度 - 轮播图负的marginBottom
          let h = parseInt(this.bannerHeight) - parseInt(this.navFullHeight) + parseInt(this.bannerBottom)
          const heightArr = []
          itemList.forEach((item) => {
            h += item.height
            heightArr.push(h)
          })
          this.heightArr = [...heightArr]
        })

        // 购物车坐标位置
        this.$('#cart').then(([cartDom]) => {
          this.cartRect = cartDom
        })
      })
    },
    formatName (name) {
      return name.replace('<br/>', '')
    }
  }
}
</script>

<style lang='scss' scoped>
  .container {
    background: #fff;
    nav {
      display: flex;
      align-items: center;
      padding: 0 20rpx;
      height: 100%;
      flex: 1;
      background: #f1f1f1;
      margin: 0 20rpx;
      border-radius: 100rpx;
      font-size: 26rpx;
      color: #000;
      .iconfont {
        color: #444;
        margin-right: 10rpx;
      }
    }
    > scroll-view {
      height: 100vh;
      .sticky {
        border-radius: 30rpx 0 0;
        width: 100vw;
        width: 100vw;
        padding: 20rpx;
        font-size: 28rpx;
        background: #fff;
        position: sticky;
        z-index: 90;
        .bar {
          width: 80rpx;
          height: 10rpx;
          background: #e3e4e2;
          border-radius: 100rpx;
          margin: 0 auto;
          margin-bottom: 10rpx;
        }
        .storeInfo {
          padding: 0 15rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .left {
            .address {
              font-size: 32rpx;
              font-weight: bold;
              color: #222;
              margin-bottom: 6rpx;
              display: inline-block;
            }
            .distance {
              display: flex;
              align-items: center;
              img {
                width: 28rpx;
                height: 28rpx;
                margin-right: 8rpx;
              }
              span {
                font-size: 24rpx;
                &:first-child {
                  color: #333;
                  font-weight: bold;
                }
                &:last-child {
                  color: #999;
                }
              }
            }
          }
          .card {
            position: relative;
            width: 136rpx;
            height: 95rpx;
            text-align: center;
            line-height: 115rpx;
            span {
              font-weight: bold;
              font-size: 32rpx;
              color: #444;
              position: relative;
            }
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 136rpx;
              height: 95rpx;
            }
          }
        }
      }
      main {
        display: flex;
        background: #fff;
        .leftSide {
          height: 100vh;
          position: sticky;
          top: 0;
          width: 130rpx;
          text-align: center;
          background: #f6f6f6;
          ::-webkit-scrollbar{
            display: none;
          }
          ul {
            padding: 0 15rpx calc(env(safe-area-inset-bottom) / 3 + 220rpx);
            li {
              height: 160rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              position: relative;
              h3 {
                font-size: 20rpx;
                color: #666;
              }
              .new {
                font-size: 18rpx;
                color: #fff;
                background: $red;
                position: absolute;
                right: -5rpx;
                top: 5rpx;
                padding: 1rpx 8rpx;
                border-radius: 100rpx 100rpx 100rpx 0;
              }
              /deep/ .m-image {
                width: 65rpx;
                height: 65rpx;
              }
              &:not(.block) {
                @extend .border-b;
              }
              &.active {
                transition: all ease .2s;
                color: $red;
                font-weight: bold;
              }
              &.block {
                transition: all ease .2s;
                background: #fff;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                z-index: -1;
                $size: 20rpx;
                border-radius: $size 0 0 $size;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                &#block0 {
                  border-radius: 0 0 0 $size;
                }
                &::before, &:after {
                  content: '';
                  position: absolute;
                  right: 0;
                  width: $size;
                  height: $size;
                }
                &::after{
                  top: 0;
                  transform: translateY(-100%);
                  background: radial-gradient(circle at 0% 0%,transparent $size,#fff 0)
                }
                &::before{
                  bottom: 0;
                  transform: translateY(100%);
                  background: radial-gradient(circle at 0% 100%,transparent $size,#fff 0)
                }
              }
            }
          }
        }
        .rightSide {
          margin-left: auto;
          flex: 1;
          padding-bottom: calc(env(safe-area-inset-bottom) / 3 + 200rpx);
          h1 {
            padding: 0 25rpx 14rpx;
            font-size: 24rpx;
            font-weight: bold;
            color: #888;
          }
          .tabs {
            padding: 0 25rpx 10rpx;
            background: #fff;
            position: sticky;
            top: 0;
            z-index: 10;
            display: flex;
            span {
              width: fit-content;
              border: 1px solid #e0e0e0;
              border-radius: 100rpx;
              padding: 6rpx 25rpx;
              font-size: 22rpx;
              color: #252525;
              margin-right: 10rpx;
            }
          }
          .list {
            padding: 0 30rpx 30rpx 20rpx;
          }
        }
      }
    }
    footer {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0 30rpx calc(env(safe-area-inset-bottom) / 3 + 30rpx);
      box-shadow: 0 -90rpx 20rpx -16rpx rgba(255, 255, 255, .9) inset;
      z-index: 999;
      > div {
        border-radius: 100rpx;
        height: 80rpx;
        display: flex;
        align-items: center;
        background: #222222;
        .cart {
          border-radius: 6rpx;
          width: 90rpx;
          height: 96rpx;
          margin-left: 32rpx;
        }
        span {
          font-weight: bold;
          margin-left: 20rpx;
          &.noDish {
            color: #979898;
            font-size: 30rpx;
          }
          &.totalPrice {
            @extend .number;
            font-size: 44rpx;
            color: #fefefe;
            &::first-letter {
              font-size: 28rpx;
              font-weight: normal;
              margin-right: 4rpx;
            }
          }
        }
        button {
          padding: 0 50rpx;
          margin-left: auto;
          font-size: 32rpx;
          font-weight: bold;
          height: 100%;
          border-radius: 100rpx;
          background: $yellow;
          color: #000;
          &[disabled] {
            background: #6a6a6a;
            color: #9b9a9a;
          }
        }
      }
    }
    /deep/ .m-popup {
      header {
        padding: 30rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        @extend .border-b;
        h1 {
          font-size: 32rpx;
          font-weight: bold;
          color: #222222;
        }
        span {
          display: flex;
          align-items: center;
          font-size: 26rpx;
          color: #666;
          .iconfont {
            margin-right: 4rpx;
            position: relative;
            font-size: 26rpx;
          }
        }
      }
      scroll-view {
        max-height: 60vh;
        ul {
          padding: 0 30rpx;
          margin-bottom: calc(env(safe-area-inset-bottom) / 3 + 160rpx);
        }
      }
    }
  }
</style>
