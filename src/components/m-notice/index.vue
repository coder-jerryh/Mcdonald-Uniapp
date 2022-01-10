<template>
  <ul class="m-notice" :style="{top, left}">
    <li :class="{show: show1}">{{newList[index1].name}} {{newList[index1][textKey]}}</li>
    <li :class="{show: show2}">{{newList[index2].name}} {{newList[index2][textKey]}}</li>
  </ul>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    top: {
      type: String,
      default: '310rpx'
    },
    left: {
      type: String,
      default: '30rpx'
    },
    textKey: {
      type: String,
      default: 'text'
    }
  },
  computed: {
    newList () {
      return this.list.sort(() => Math.random() > 0.5 ? -1 : 1)
    }
  },
  data () {
    return {
      show1: false,
      show2: false,
      showTimer1: null,
      showTimer2: null,
      timer1: null,
      timer2: null,
      timer3: null,
      index1: 0,
      index2: 1
    }
  },
  created () {
    this.showDom()
    this.changeContent()
  },
  methods: {
    showDom () {
      this.showTimer1 = setTimeout(() => {
        this.show1 = true
        clearTimeout(this.showTimer1)
      }, 500)
      this.showTimer2 = setTimeout(() => {
        this.show2 = true
        clearTimeout(this.showTimer2)
      }, 3000)
    },
    changeContent () {
      this.timer1 = setInterval(() => {
        this.index1 += 2
        if (!this.newList[this.index1]) {
          this.index1 = 0
        }
      }, 5000)
      this.timer2 = setTimeout(() => {
        this.timer3 = setInterval(() => {
          this.index2 += 2
          if (!this.newList[this.index2]) {
            this.index2 = 0
          }
        }, 5000)
        clearTimeout(this.timer2)
      }, 2500)
    }
  },
  beforeDestroy () {
    clearTimeout(this.showTimer1)
    clearTimeout(this.showTimer2)
    clearInterval(this.timer1)
    clearTimeout(this.timer2)
    clearInterval(this.timer3)
  }
}
</script>

<style lang='scss' scoped>
  .m-notice {
    position: absolute;
    z-index: 10;
    width: calc(100% - 36rpx);
    @keyframes transform {
      0% {
        transform: translateY(100%) scale(.8);
        opacity: 0;
      }
      20%, 50% {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
      70%, 100% {
        transform: translateY(-100%) scale(.8);
        opacity: 0;
      }
    }
    li {
      position: absolute;
      font-size: 22rpx;
      color: #fff;
      background: rgba(0, 0, 0, 0.4);
      padding: 8rpx 18rpx;
      border-radius: 100rpx;
      animation: transform 5000ms ease infinite forwards;
      transform: translateY(100%) scale(.8);
      opacity: 0;
      transform-origin: left;
      &.show {
        opacity: 1;
      }
      &:last-child {
        animation-delay: 2500ms;
      }
    }
  }
</style>
