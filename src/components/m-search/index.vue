<template>
  <div class="m-search" @click="$emit('click')" :style="{margin}">
    <img class="searchIcon" src="../../assets/image/search.png">
    <input
      confirm-type='search'
      placeholder="输入关键词搜索"
      v-model="searchVal"
      placeholder-class='placeholder'
      :focus='focus || inputFocus'
      :disabled='disabled'
      @focus="$emit('focus')"
      @blur="blur"
      @confirm="confirm"
      @input="input">
    <i v-if="searchVal" class="iconfont icon-fill-close" @click="clear"></i>
    <button v-if="!hideBtn" @click="confirm">搜索</button>
  </div>
</template>

<script>
export default {
  props: {
    hideBtn: Boolean,
    value: String,
    disabled: Boolean,
    margin: String,
    focus: Boolean
  },
  data () {
    return {
      inputFocus: false,
      searchVal: ''
    }
  },
  watch: {
    value: {
      handler () {
        this.searchVal = this.value
      },
      immediate: true
    }
  },
  mounted () {
    this.inputFocus = !this.hideBtn
  },
  methods: {
    input () {
      this.$emit('input', this.searchVal)
      if (!this.searchVal) {
        this.confirm()
      }
    },
    blur () {
      this.inputFocus = false
      this.$emit('blur')
    },
    clear () {
      this.inputFocus = true
      this.searchVal = ''
      this.input()
      this.$emit('clear')
    },
    confirm () {
      this.$emit('confirm', this.searchVal)
    }
  }
}
</script>

<style lang='scss' scoped>
  .m-search {
    position: relative;
    padding: 20rpx 0 20rpx 20rpx;
    @extend .y-center;
    transition: all ease .25s;
    height: 70rpx;
    flex: 1;
    border: 2px solid transparent;
    border-radius: 100rpx;
    z-index: 10;
    background: #F4F4F4;
    .searchIcon {
      margin-right: 16rpx;
      width: 28rpx;
      height: 28rpx;
      position: relative;
    }
    input {
      font-size: 26rpx;
      height: 100%;
      flex: 1;
      &.placeholder {
        color: #BCBCBD;
      }
    }
    .icon-fill-close {
      font-size: 40rpx;
      color: #ccc;
      position: relative;
      margin: 0 6rpx;
      &:active {
        opacity: .7;
      }
    }
    button {
      margin-left: 12rpx;
      height: 70rpx;
      padding: 0 32rpx;
      background: $bgColor;
      color: #fff;
      border-radius: 100rpx;
      margin-right: 1px;
    }
  }
</style>
