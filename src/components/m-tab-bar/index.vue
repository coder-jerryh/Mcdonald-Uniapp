<template>
  <ul class="tab-bar">
    <li v-for="(item, i) in list" :key="i" class="tab-bar-item" @click="switchTab(item, i)">
      <img :class="{show: selected === i}" :src="item.selectedIconPath" :style="{width: item.width || '27px'}"/>
      <img :class="{show: selected !== i}" :src="item.iconPath" :style="{width: item.width || '27px'}"/>
      <span :style="{color: selected === i ? selectedColor : color}">{{item.text}}</span>
      <i class="badge" v-if="i == 2 && unReadCount">{{unReadCount}}</i>
    </li>
  </ul>
</template>

<script>
import {getSystemMsgListApi, getUnreadCountApi} from '../../api/msg'
export default {
  props: {
    value: Number
  },
  data () {
    return {
      unReadCount: 0,
      selected: 0,
      color: '#9AA1A7',
      selectedColor: '#0E1A25',
      list: [
        {
          'selectedIconPath': require('static/shouyes.png'),
          'iconPath': require('static/shouye.png'),
          'pagePath': 'pages/homePage/index',
          'text': '首页'
        },
        {
          'selectedIconPath': require('static/quanzis.png'),
          'iconPath': require('static/quanzi.png'),
          'pagePath': 'pages/circle/index',
          'text': '圈子'
        },
        {
          'selectedIconPath': require('static/xiaoxis.png'),
          'iconPath': require('static/xiaoxi.png'),
          'pagePath': 'pages/msg/index',
          'text': '消息'
        },
        {
          'selectedIconPath': require('static/wodes.png'),
          'iconPath': require('static/wode.png'),
          'pagePath': 'pages/mine/index',
          'text': '我的'
        }
      ]
    }
  },
  created () {
    this.selected = this.value
  },
  methods: {
    switchTab (item, i) {
      const url = `/${item.pagePath}`
      uni.switchTab({url})
    },
    getSystemMsg () {
      if (!this.isLogin) return
      // 第一条消息
      getSystemMsgListApi({page: 1, pageSize: 1}).then(({data}) => {
        this.$emit('update:newSystemMsg', data.list[0])
      })
      // 未读消息数量
      getUnreadCountApi().then(({data}) => {
        this.unReadCount = data
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: calc(50px + env(safe-area-inset-bottom) / 1.5);
    background: #fff;
    display: flex;
    z-index: 999;
    padding-bottom: calc(env(safe-area-inset-bottom) / 1.5);
    @extend .border-t;
    .tab-bar-item {
      flex: 1;
      @extend .xy-center;
      position: relative;
      &:nth-child(2) {
        display: none;
      }
      img {
        width: 27px;
        height: 27px;
        margin-bottom: 2rpx;
        display: none;
        &.show {
          display: block;
        }
      }
      span {
        font-size: 12px;
      }
      .badge {
        display: block;
        position: absolute;
        top: -8rpx;
        right: 44rpx;
        background: $red;
        border-radius: 50%;
        color: #fff;
        font-size: 22rpx;
        min-width: 36rpx;
        text-align: center;
        padding: 2rpx 4rpx;
        z-index: 10;
      }
    }
  }
</style>
