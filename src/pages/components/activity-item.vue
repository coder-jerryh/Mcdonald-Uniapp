<template>
  <li @click="toDetail(item)" class="activity-item" :class="[isRow ? 'row' : 'column', {isMine}]">
    <div class="pic">
      <m-image :src='item.cover' :index='index'/>
    </div>
    <div class="content">
      <div class="title">
        <i class="type" v-if="isRow">{{item.type == 1 ? '线上' : '线下'}}</i>
        <h1>{{item.title}}{{item.title}}</h1>
      </div>
      <div class="priceDistance">
        <p class="price">
          <i class="zhuan">赚</i>
          <span>{{item.salary}}<i>/次</i></span>
        </p>
        <p class="distance" v-if="isRow">
          <img src="../../assets/image/location3.png" alt="">
          <span>{{newItem.distance}}km</span>
        </p>
      </div>
      <p class="prestore" v-if="isMine">已预存：¥{{item.budget}}</p>
      <p class="address" v-if="isRow">地址：{{item.address_name}}</p>
      <!-- 时间 -->
      <template>
        <p class="time" v-if="isEnd">活动时间：活动已结束</p>
        <p class="time" v-else-if="willStart">开始时间：{{$dateFilter(item.start_time)}}</p>
        <p class="time" v-else>剩余时间：<span v-if="newItem.time.d">{{newItem.time.d}}</span>天<span>{{newItem.time.h}}</span>小时<span>{{newItem.time.m}}</span>分</p>
      </template>
      <p class="distance" v-if="isColumn">
        <img src="../../assets/image/location3.png" alt="">
        <span>{{newItem.distance}}km</span>
      </p>
    </div>
    <template v-if="isRow">
      <!-- 我的 -->
      <div class="toolbar" v-if="isMine">
        <!-- 状态 -->
        <span class="status" :class="'status' + item.status">{{statusOption[item.status]}}</span>
        <!-- 待推广 -->
        <template v-if="item.status == 1">
          <button class="plain" @click.stop="cancelActivity(item)">取消</button>
          <button @click.stop="$toUrl(`/pages/mine/myPromotion/promotion?id=${item.activity_id}`)">推广</button>
        </template>
        <!-- 待审核 -->
        <template v-if="item.status == 2">
          <button class="plain" @click.stop="cancelActivity(item)">取消</button>
        </template>
        <!-- 未通过 -->
        <template v-if="item.status == 4">
          <button class="plain" @click.stop="showReason(item)">查看原因</button>
          <button class="plain" @click.stop="cancelActivity(item)">取消</button>
          <button class="plain" @click.stop="$toUrl(`/pages/mine/myPromotion/appeal?id=${item.activity_id}&title=${item.title}`)">申诉</button>
          <button @click.stop="$toUrl(`/pages/mine/myPromotion/promotion?id=${item.id}&reSubmit=true`)">重新推广</button>
        </template>
        <!-- 待评价 -->
        <template v-if="item.status == 3">
          <button class="plain" @click.stop="$toUrl(`/pages/mine/myPromotion/toComment?id=${item.activity_id}`)">评价</button>
        </template>
        <!-- 已取消 -->
        <template v-if="item.status == 5">
          <button class="plain" @click.stop="delActivity(item)">删除</button>
        </template>
        <!-- <button @click.stop="submitActivity(item)" disabled>提交任务</button> -->
      </div>
      <!-- 大厅 -->
      <div class="toolbar" v-else>
        <img src="../../assets/image/hot.png" alt="">
        <p>已有<span>{{item.qualified_number}}</span>人赚到佣金</p>
        <button>立即赚钱</button>
      </div>
    </template>
  </li>
</template>

<script>
import {getVipInfoApi} from '../../api/mine'
import {cancelActivityApi, delActivityApi, submitActivityApi} from '../../api/activity'
import {computedTime} from '../../utils/filters'
export default {
  props: {
    item: Object,
    index: [String, Number],
    isRow: Boolean,
    isColumn: Boolean,
    isMine: Boolean
  },
  data () {
    return {
      now: new Date().getTime(),
      statusOption: {
        1: '待推广',
        2: '待审核',
        3: '已完成',
        4: '未通过',
        5: '已取消'
      }
    }
  },
  computed: {
    isEnd () {
      return new Date().getTime() > this.item.end_time * 1000
    },
    newItem () {
      return {
        ...this.item,
        distance: this.item.juli.toFixed(2),
        time: computedTime(this.item.end_time * 1000 - new Date().getTime(), true)
      }
    },
    willStart () {
      return this.item.start_time > new Date().getTime()
    }
  },
  methods: {
    toDetail (item) {
      this.$toUrl(`/pages/activity/detail?id=${item.id}`, 'verifyLogin')
    },
    // 提交任务
    submitActivity (item) {
      const params = {
        activityId: item.id,
        address: '1561356.6562,21232.1',
        addressName: '我也不知道这里是哪',
        content: '随便照照',
        images: 'sgegfwefn;sdfpoa,werpj-23n;lsndfpjsadsd'
      }
      submitActivityApi(params).then(() => {
        this.$Toast('success', '提交任务成功！')
      })
    },
    showReason (item) {
      this.$Alert(
        '未通过原因',
        item.remark,
        '我知道了'
      )
    },
    cancelActivity (item) {
      this.$Confirm(
        '提示',
        '确定取消该活动吗？',
        '确定',
        () => {
          cancelActivityApi({id: item.id}).then(() => {
            this.$Toast('success', '已取消该活动！')
            this.$emit('firstPage', true)
          })
        }
      )
    },
    delActivity (item) {
      this.$Confirm(
        '提示',
        '确定删除该活动吗？',
        '确定',
        () => {
          delActivityApi({id: item.id}).then(() => {
            this.$Toast('success', '已删除该活动！')
            this.$emit('firstPage', true)
          })
        }
      )
    },
    getVipInfo () {
      if (!this.$taxRate) {
        // 抽成比例
        getVipInfoApi().then(({data}) => {
          this.$taxRate = data[0].tax_rate * 0.01
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
  li {
    display: flex;
    margin-bottom: 30rpx;
    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        @extend .y-center;
        .type {
          @extend .xy-center;
          width: 72rpx;
          height: 36rpx;
          border-radius: 4rpx;
          border: 1px solid #03B349;
          font-size: 26rpx;
          color: #03B349;
          margin-right: 16rpx;
        }
        h1 {
          font-size: 30rpx;
          font-weight: bold;
          color: #333;
          @extend .one-line;
        }
      }
      .priceDistance {
        @extend .y-center;
        .price {
          margin-right: auto;
          @extend .y-center;
          .zhuan {
            width: 34rpx;
            height: 34rpx;
            @extend .xy-center;
            color: #fff;
            background: $orange;
            border-radius: 4rpx;
            font-size: 22rpx;
            margin-right: 10rpx;
          }
          span {
            color: $orange;
            font-size: 28rpx;
            @extend .y-center;
            font-weight: bold;
            &::before {
              content: '￥';
              font-weight: normal;
            }
            i {
              font-size: 24rpx;
              color: #333;
              font-weight: normal;
            }
          }
        }
      }
      .distance {
        @extend .y-center;
        img {
          width: 20rpx;
          height: 24rpx;
        }
        span {
          color: #999;
          font-size: 24rpx;
          margin-left: 6rpx;
        }
      }
      .address, .time, .prestore {
        font-size: 26rpx;
        color: #666;
        @extend .y-center;
        &.address {
          display: inline-block;
          @extend .one-line;
          max-width: 450rpx;
        }
        span {
          color: $orange;
        }
      }
    }
    &.column {
      box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.1);
      border-radius: 16rpx;
      overflow: hidden;
      flex-direction: column;
      .title h1 {
        width: 294rpx;
      }
      .pic {
        position: relative;
        /deep/ .m-image {
          width: 335rpx;
          height: 208rpx;
          border-radius: 16rpx 16rpx 0 0;
        }
      }
      .time {
        @extend .one-line;
        max-width: 294rpx;
      }
      .content {
        height: 226rpx;
        padding: 20rpx;
      }
    }
    &.row {
      flex-direction: row;
      padding-bottom: 118rpx;
      position: relative;
      .title h1 {
        width: 370rpx;
      }
      .pic {
        position: relative;
        margin-right: 30rpx;
        /deep/ .m-image {
          width: 196rpx;
          height: 196rpx;
          border-radius: 16rpx;
        }
      }
      .content {
        flex: 1;
        height: 196rpx;
      }
      &.isMine .content{
        height: 240rpx;
      }
      .toolbar {
        right: 0;
        bottom: 30rpx;
        left: 0;
        position: absolute;
        @extend .y-center;
        img {
          width: 23rpx;
          height: 26rpx;
          margin-right: 15rpx;
        }
        p {
          @extend .y-center;
          font-size: 26rpx;
          color: #999;
          span {
            font-size: 30rpx;
            color: $orange;
            font-weight: bold;
            margin: 0 6rpx;
            position: relative;
            top: 1rpx;
          }
        }
        .status {
          font-size: 28rpx;
          color: #333;
          &.status1, &.status2 {
            color: $orange;
          }
          &.status3, &.status6 {
            color: $green;
          }
          &.status4 {
            color: $red;
          }
          &.status5 {
            color: #aaa;
          }
          
        }
        button {
          padding: 0 24rpx;
          height: 58rpx;
          background: linear-gradient(90deg, #FFAB80 0%, #FF7828 100%);
          border-radius: 100rpx;
          font-size: 26rpx;
          color: #fff;
          &[disabled] {
            background: linear-gradient(90deg, #DDDDDD 0%, #B7BABF 100%);
          }
          &.plain {
            background: #fff;
            color: #666;
            border: 1px solid #B3B3B3;
          }
          &:first-of-type {
            margin-left: auto;
          }
          &+button {
            margin-left: 15rpx;
          }
        }
      }
    }
  }
</style>
