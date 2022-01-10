<template>
  <li class="dish-item" :class="{isCartItem}">
    <div :class="'dishPic' + item.productCode" @click="$toUrl('/pages/homePage/detail')">
      <m-image :src="item.productImage || ''" :index='item.productCode'/>
    </div>
    <div class="info">
      <h2>{{item.productName}}</h2>
      <p>{{item.memo}}</p>
      <div class="tag" v-if="!isCartItem">
        <span v-for="tag in item.productTagList" :key="tag">{{tag}}</span>
      </div>
      <div class="price">
        <!-- 在购物车列表中显示总价 -->
        <span v-if="isCartItem">¥{{totalPrice}}</span>
        <!-- 不在购物车列表中显示单价 -->
        <span v-else>¥{{item.priceInfo.deliveryPriceText}}</span>
        <!-- 选规格 -->
        <m-badge :count='count' v-if="item.isChoices && !isCartItem">
          <button class="select" @click="$toUrl('/pages/homePage/detail')">选规格</button>
        </m-badge>
        <!-- 直接加购 -->
        <counter v-else :count='count || 0' @add='addDish(item)' @reduce='reduceDish(item)'/>
      </div>
    </div>
  </li>
</template>

<script>
import counter from './counter.vue'
export default {
  components: {
    counter
  },
  props: {
    item: Object,
    codeCountOption: Object,
    isCartItem: Boolean
  },
  data () {
    return {}
  },
  computed: {
    // 数量
    count () {
      if (this.codeCountOption && Object.values(this.codeCountOption).length) {
        return this.codeCountOption[this.item.productCode] || 0
      } else {
        return 0
      }
    },
    // 总价
    totalPrice () {
      if (this.isCartItem) {
        return (this.item.priceInfo.deliveryPriceText * this.count).toFixed(1)
      } else {
        return 0
      }
    }
  },
  methods: {
    // 添加购物车
    addDish (item, count = +1) {
      this.$(`.dishPic${item.productCode}`).then(([dishPicDom]) => {
        this.$emit('changeDish', dishPicDom, item, count)
      })
    },
    // 移除购物车
    reduceDish (item) {
      this.$emit('changeDish', null, item, -1)
    }
  }
}
</script>

<style lang='scss' scoped>
  .dish-item {
    padding: 24rpx 0;
    display: flex;
    align-items: center;
    @extend .border-b;
    /deep/ .m-image {
      width: 260rpx;
      height: 200rpx;
      margin-right: 15rpx;
    }
    .info {
      flex: 1;
      h2 {
        font-size: 28rpx;
        font-weight: bold;
      }
      p {
        color: #999;
        font-size: 20rpx;
        margin: 8rpx 0 10rpx;
        @include line(2);
      }
      .tag {
        margin-bottom: 15rpx;
        display: flex;
        span {
          display: flex;
          align-items: center;
          font-size: 20rpx;
          border-radius: 5rpx;
          padding: 0 6rpx;
          height: 30rpx;
          background: #fff;
          color: $red;
          border: 1px solid $red;
          margin-right: 10rpx;
          &:first-child {
            background: $red;
            color: #fff;
            border: none;
            position: relative;
            padding-right: 10rpx;
            &::after {
              position: absolute;
              content: '';
              width: 12rpx;
              height: 12rpx;
              background: #fff;
              border-radius: 50%;
              right: 0;
              top: 50%;
              transform: translate(50%, -50%);
            }
          }
        }
      }
      .price {
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          color: #202020;
          font-size: 38rpx;
          font-weight: bold;
          @extend .number;
          &::first-letter {
            font-size: 24rpx;
            font-weight: normal;
            margin-right: 4rpx;
          }
        }
        .select {
          font-size: 20rpx;
          background: $yellow;
          color: #222;
          border-radius: 100rpx;
          padding: 0 15rpx;
          height: 46rpx;
          font-weight: bold;
        }
      }
    }
    &.isCartItem {
      /deep/ .m-image {
        width: 208rpx;
        height: 160rpx;
      }
      .price {
        margin-top: 20rpx;
      }
    }
  }
</style>
