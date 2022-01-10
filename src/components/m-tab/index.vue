<template>
  <scroll-view
    :scroll-with-animation='true'
    :scroll-left='scrollLeft'
    enable-flex
    scroll-x
    :class="{border, sticky, center}"
    :style="{background}"
     class="m-tab">
    <ul :class="{spaceBetween}">
      <li
        class="tab"
        v-for="(item, index) in newList" :key="index"
        @click="change(item, index)">
        <slot v-if="$slots.default" :item='item' :value='value'/>
        <span
          v-else
          :style="{'--font-size': fontSize}"
          :class="{active: item.value === value}"
          >{{item.name}}</span>
      </li>
      <!-- 下划线 -->
      <i
        v-if="underline"
        class="underline"
        :class="{isChanged}"
        :style="{
          left: underlineLeft + 'px',
          width: underlineWidth + 'px'
        }"
      ></i>
    </ul>
  </scroll-view>
</template>

<script>
  export default{
    props: {
      center: Boolean,
      spaceBetween: Boolean,
      list: Array,
      value: [Number, String],
      border: {
        type: Boolean,
        default: true
      },
      nameKey: {
        type: String,
        default: 'name'
      },
      valueKey: {
        type: String,
        default: 'value'
      },
      fontSize: {
        type: String,
        default: '30rpx'
      },
      background: {
        type: String,
        default: '#fff'
      },
      underline: {
        type: Boolean,
        default: true
      },
      sticky: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        underlineLeft: 0,
        underlineWidth: 0,
        tabLeft: 0,
        tabDom: [],
        newList: [],
        windowWidth: 0,
        scrollLeft: 0,
        isGettedDom: false,
        isChanged: false
      }
    },
    watch: {
      list: {
        handler () {
          this.newList = this.list.map((item, i) => {
            return {
              ...item,
              name: item[this.nameKey],
              value: item[this.valueKey]
            }
          })
          this.getTabDom()
        },
        deep: true,
        immediate: true
      },
      value: {
        handler () {
          this.list.length && this.scrollX()
        },
        immediate: true
      }
    },
    mounted () {
      wx.getSystemInfo({
        success: (res) => {
          this.windowWidth = res.windowWidth
        }
      })
      this.getTabDom()
    },
    methods: {
      change (item, i) {
        this.$emit('input', item.value)
        this.$emit('change', i, item)
        this.isChanged = true
      },
      scrollX () {
        const i = this.getIndex()
        const currentTab = this.tabDom[i]
        if (i < 0 || !this.tabDom.length) return
        this.underlineWidth = currentTab.width / 3
        this.underlineLeft = currentTab.left - this.tabLeft + currentTab.width / 2 - this.underlineWidth / 2
        this.scrollLeft = currentTab.left - this.windowWidth / 2 + currentTab.width / 2
      },
      getTabDom () {
        this.$nextTick(() => {
          uni.createSelectorQuery().in(this).select('.m-tab').boundingClientRect().exec(res => {
            this.tabLeft = res[0].left
          })
          uni.createSelectorQuery().in(this).selectAll('.tab').boundingClientRect().exec(res => {
            this.tabDom = res[0]
            this.scrollX()
            this.isGettedDom = Boolean(res[0].length)
          })
        })
      },
      getIndex () {
        return this.newList.findIndex(item => item.value === this.value)
      }
    }
  }
</script>
<style lang="scss" scoped>
  scroll-view {
    background: var(--background);
    // 边框
    &.border {
      @extend .border-b;
    }
    &.sticky {
      position: sticky;
      width: 100%;
      top: 0;
      z-index: 10;
    }
    // 居中
    &.center {
      width: fit-content;
      margin: 0 auto;
    }
    ul {
      position: relative;
      height: 90rpx;
      display: flex;
      &.border{
        border-bottom: 1rpx solid $border;
      }
      // 两端对齐
      &.spaceBetween {
        width: 100%;
        justify-content: space-evenly;
      }
      .tab {
        white-space: nowrap;
        @extend .y-center;
        color: #222;
        padding: 0 25rpx 10rpx;
        span {
          transition: color ease .25s;
          font-size: var(--font-size);
          &.active {
            font-weight: bold;
            background: $bgColor;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }
      // 下划线
      .underline {
        border-radius: 100rpx;
        display: inline-block;
        position: absolute;
        height: 6rpx;
        background: $bgColor;
        bottom: 16rpx;
        // 下划线在页面渲染后第一次滑动时，无需动画效果
        &.isChanged {
          transition: all ease .25s;
        }
      }
    }
  }
</style>
