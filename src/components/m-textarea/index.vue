<template>
  <textarea
    class="m-textarea"
    :class="{hasPadding}"
    v-model="newVal"
    placeholder-class="placeholder"
    maxlength="9999"
    :show-confirm-bar='true'
    :placeholder='placeholder'
    :cursor-spacing='cursorSpacing'
    :adjust-position='adjustPosition'
    :focus='focus'
    :disabled='disabled'
    @click="$emit('click')"
    @input="input"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"/>
</template>

<script>
export default {
  props: {
    value: String,
    cursorSpacing: {
      type: [String, Number],
      default: 20
    },
    placeholder: String,
    adjustPosition: {
      type: Boolean,
      default: true
    },
    focus: Boolean,
    disabled: Boolean
  },
  data () {
    return {
      newVal: String
    }
  },
  computed: {
    hasPadding () {
      return uni.getSystemInfoSync().platform === 'android' || __wxConfig.envVersion === 'develop'
    }
  },
  watch: {
    value () {
      this.newVal = this.value
    }
  },
  methods: {
    input (e) {
      this.$emit('input', this.newVal)
    }
  }
}
</script>

<style lang='scss' scoped>
  textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 4rpx 8rpx;
    font-size: 28rpx;
    line-height: 1.5;
    &.hasPadding {
      padding: 20rpx;
    }
  }
  .placeholder{
    color: #999;
  }
</style>
