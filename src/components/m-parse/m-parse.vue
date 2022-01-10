<template>
  <rich-text v-html="newContent"></rich-text>
</template>

<script>
export default {
  props: {
    content: String
  },
  computed: {
    newContent () {
      let newContent = this.content
      newContent = newContent.replace(/<img /g, `<span style='width: 22px;height: 12px;position: relative;display:inline-block'><img style='width: 22px;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%)'`)
      newContent = newContent.replace(/\/>/g, '/></span>')
      return `<p>${newContent}</p>`
    }
  },
  data () {
    return {
    }
  },
  created () {}
}
</script>

<style lang='scss' scoped>
  article {
    /deep/ img {
      width: 40rpx;
      height: 40rpx;
    }
  }
</style>
