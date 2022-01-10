<template>
  <div class="container" @touchmove.stop.prevent>
    <!-- 导航栏 -->
    <m-header v-model="navInfo" background='transparent' back/>
    <!-- 图片 -->
    <div class="pic" :style="{paddingTop: navInfo.top}">
      <!-- 餐品图 -->
      <img  :src="comboDetail.image" mode='aspectFill'>
    </div>
    <div class="title">
      <h1>{{comboDetail.name}}</h1>
      <counter :count='count' disabled @add='count++' @reduce='count--'/>
    </div>
    <main>
      <scroll-view scroll-y enable-back-to-top>
        <p class="memo">{{comboDetail.memo}}</p>
        <!-- 套餐已包含 -->
        <template v-if="costInclusiveItems.length">
          <h2>已包含</h2>
          <ul class="comboItems costInclusive">
            <li v-for="item in costInclusiveItems" :key="item.idx">
              <ul class="comboProducts">
                <li v-for="(productItem, i) in item.comboProducts" :key="i">
                  <m-image :src='productItem.image' :index='i'/>
                  <h3>{{productItem.name}}</h3>
                  <button v-if="productItem.customizationMode">定制</button>
                </li>
              </ul>
            </li>
          </ul>
        </template>
        <!-- 未包含 -->
        <ul class="comboItems" v-if="costInclusiveItems.length || costSelectableItems.length">
          <li v-for="item in costSelectableItems" :key="item.idx">
            <h2>{{item.name}}(单选)</h2>
            <ul class="comboProducts">
              <li v-for="(productItem, i) in item.comboProducts" :key="i" :class="{checked: productItem.isDefault}"
                @click="select(item.comboProducts, productItem)">
                <m-radio v-model="productItem.isDefault" readonly/>
                <m-image :src='productItem.image' :index='i'/>
                <h3>{{productItem.name}}</h3>
                <span>{{!productItem.diffPrice ? '¥0' : productItem.diffPriceText}}</span>
                <button v-if="productItem.customizationMode && productItem.isDefault" @click="customize(productItem)">定制</button>
              </li>
            </ul>
          </li>
        </ul>
        <article v-if="costSelectableItems.length">
          <h4>说明</h4>
          <p>1. 食品、玩具、周边及包装以实物为准，图片仅供参考。</p>
          <p>2. 如产品为定制的现制现售产品，拆封后易致产品品质发生改变，通常不适用退货服务，请谅解。</p>
          <p>3. 图示如有节省的价格或折扣比例，是与不参加优惠活动情况下单单独购买该产品的常规价格（或者其中所含单品的常规单买价总和）相比较。</p>
          <p>4. 图示如有划线价格或单买价，并非指原价，而是指不参与优惠活动情况下该产品在门店销售的常规价格或者指单独购买该套餐组合中所含单品的常规价格总和。</p>
          <p>5. 如套餐中含有玩具，玩具可能会有数量限制，送完为止，玩具具体款式以餐厅实际供应情况为准。</p>
          <p>6. 除所推广产品外，其他物品仅为装饰目的，不在售卖范围内。</p>
        </article>
      </scroll-view>
    </main>
    <!-- 底部 -->
    <footer>
      <button class="recover" @click="recoverDefault">恢复默认</button>
      <button class="addCart" @click="addCart"><span>¥{{(comboDetail.priceText * count) || 0}}</span>加入购物车</button>
    </footer>
  </div>
</template>

<script>
import {comboDetail} from './data'
import counter from './counter.vue'
export default {
  components: {
    counter
  },
  data () {
    return {
      comboDetail: {},
      // 套餐已包含
      costInclusiveItems: [],
      // 套餐可选
      costSelectableItems: [],
      // 原价
      originPrice: 0,
      // 数量
      count: 1,
      /** @nav **/
      navInfo: {}
    }
  },
  onShareAppMessage () {
    return {
      title: `Jerry邀请你看看他的小程序`
    }
  },
  onReady () {
    this.comboDetail = comboDetail
    this.originPrice = comboDetail.priceText
    comboDetail.comboItems.forEach(item => {
      if (+item.costInclusive === 1) {
        // 套餐已包含
        this.costInclusiveItems.push(item)
      } else {
        // 套餐可选
        this.costSelectableItems.push(item)
      }
    })
  },
  methods: {
    // 选中
    select (comboProducts, productItem) {
      console.log(productItem)
      comboProducts.forEach(item => {
        item.isDefault = false
      })
      productItem.isDefault = true

      this.comboDetail.priceText = this.originPrice
      this.costSelectableItems.forEach(item => {
        item.comboProducts.forEach(productItem => {
          if (productItem.isDefault) {
            this.comboDetail.priceText = +this.comboDetail.priceText + productItem.diffPrice / 100
          }
        })
      })
    },
    // 定制
    customize (productItem) {

    },
    // 加购
    addCart () {
      uni.setStorageSync('addCartCombo', {
        count: this.count,
        productCode: comboDetail.code
      })
      uni.navigateBack()
    },
    // 恢复默认
    recoverDefault () {
      this.comboDetail.priceText = this.originPrice
      this.costSelectableItems.forEach(item => {
        item.comboProducts.forEach((productItem, i) => {
          productItem.isDefault = i === 0 ? 1 : 0
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .container {
    height: 100vh;
    background: #fff;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .pic {
      height: 530rpx;
      padding-bottom: 50rpx;
      width: 100vw;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      background: #444;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1;
      }
      &::before {
        content: '';
        position: absolute;
        z-index: 0;
        background: $yellow;
        width: 50vw;
        height: 300rpx;
        border-radius: 50%;
        left: 50%;
        bottom: -50rpx;
        transform: translate(-50%);
        filter: blur(6px);
        box-shadow: 0 0 100rpx 80rpx $yellow;
      }
      img {
        width: 480rpx;
        height: 370rpx;
        position: relative;
        z-index: 2;
      }
    }
    .title {
      position: relative;
      z-index: 3;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx 30rpx 20rpx;
      margin-top: -50rpx;
      border-radius: 30rpx 0 0;
      h1 {
        font-size: 38rpx;
        font-weight: bold;
        color: #222;
      }
    }
    main {
      flex: 1;
      overflow: hidden;
      padding-bottom: calc(env(safe-area-inset-bottom) / 3 + 138rpx);
      scroll-view {
        height: 100%;
        box-sizing: border-box;
        z-index: 3;
        position: relative;
        padding: 0 0 0 30rpx;
        ::-webkit-scrollbar{
          display: none;
        }
        .memo {
          color: #666;
          font-size: 26rpx;
          margin-bottom: 30rpx;
          padding-right: 30rpx;
        }
        h2 {
          font-size: 24rpx;
          color: #999;
          margin-bottom: 18rpx;
        }
        .comboItems {
          .comboProducts {
            display: flex;
            flex-wrap: wrap;
            li {
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 210rpx;
              height: 350rpx;
              border-radius: 12rpx;
              padding: 5rpx 30rpx 20rpx;
              margin-bottom: 30rpx;
              margin-right: 30rpx;
              m-radio {
                position: absolute;
                top: 12rpx;
                right: 12rpx;
              }
              /deep/ .m-image {
                width: 154rpx;
                height: 154rpx;
              }
              h3 {
                height: 40rpx;
                font-size: 20rpx;
                font-weight: bold;
                color: #222;
                text-align: center;
              }
              span {
                @extend .number;
                display: block;
                margin-top: 20rpx;
                font-size: 34rpx;
                color: #222;
                font-weight: bold;
                flex: 1;
              }
              button {
                margin: auto 10rpx 0;
                background: $yellow;
                color: #222;
                font-size: 23rpx;
                border-radius: 12rpx;
                width: 130rpx;
                height: 46rpx;
              }
              &.checked {
                background: #f6f6f5;
              }
            }
          }
          &.costInclusive {
            display: flex;
            flex-wrap: wrap;
            @extend .border-b;
            margin-bottom: 40rpx;
            .comboProducts {
              li {
                margin-right: 0;
                height: 300rpx;
                margin-bottom: 10rpx;
              }
              &:not(:nth-child(3n)) {
                margin-right: 30rpx;
              }
            }
          }
        }
        article {
          padding: 0 30rpx 60rpx 0;
          font-size: 24rpx;
          color: #999;
          h4 {
            margin-bottom: 18rpx;
            font-weight: bold;
          }
          p {
            margin-bottom: 4rpx;
          }
        }
      }
    }
    footer {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 30rpx 30rpx calc(env(safe-area-inset-bottom) / 3 + 30rpx);
      z-index: 999;
      display: flex;
      @extend .border-t;
      button {
        font-size: 32rpx;
        font-weight: bold;
        height: 80rpx;
        border-radius: 100rpx;
        color: #000;
        &.recover {
          width: 220rpx;
          border: 1px solid #d9dad9;
          background: #fff;
        }
        &.addCart {
          flex: 1;
          background: $yellow;
          margin-left: 30rpx;
          display: flex;
          align-items: center;
          span {
            @extend .number;
            margin-right: 8rpx;
            font-size: 38rpx;
            &::first-letter {
              font-size: 28rpx;
              font-weight: normal;
              margin-right: 4rpx;
            }
          }
        }
        &[disabled] {
          background: #6a6a6a;
          color: #9b9a9a;
        }
      }
    }
  }
</style>
