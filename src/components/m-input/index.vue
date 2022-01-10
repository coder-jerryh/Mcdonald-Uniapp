<template>
  <input
    class="m-input"
    v-model="inputValue"
    :disabled='disabled'
    :placeholder='placeholder'
    :type='type'
    :maxlength='maxlength || 50'
    :focus='focus'
    @input="input"
  >
</template>

<script>
export default {
  props: {
    value: [Number, String],
    type: String,
    placeholder: String,
    disabled: Boolean,
    maxlength: [Number, String],
    focus: Boolean
  },
  data () {
    return {
      inputValue: ''
    }
  },
  watch: {
    value: {
      handler () {
        this.inputValue = this.value
      },
      immediate: true
    }
  },
  methods: {
    input () {
      if (['number', 'digit'].includes(this.type) && this.inputValue !== '') {
        this.inputValue = Number(this.inputValue)
      }
      this.$emit('input', this.inputValue)
    }
  }
}
</script>

<style lang='scss' scoped>
  input {
    box-sizing: border-box;
  }
</style>
