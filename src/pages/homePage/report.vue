<template>
  <div class="opinion">
    <section class="form">
      <h1>举报商家：{{form.merchantName}}</h1>
      <div>
        <label>举报原因</label>
        <div class="btnTabs">
          <button
            class="opacity"
            v-for="item in tabs" :key="item"
            :class="{active: form.reportType == item}"
            @click="form.reportType = item"
          >{{item}}</button>
        </div>
      </div>
      <div class="detail">
        <label>详细描述</label>
        <m-textarea v-model="form.content" placeholder="请输入你遇到的问题"/>
      </div>
      <div>
        <label>上传照片</label>
        <m-upload v-model="form.images" :limit='9' size='small' dataType='string'/>
      </div>
    </section>
    <div class="bottomBtn">
      <button @click="submit">提交</button>
    </div>
  </div>
</template>

<script>
import mUpload from '../../components/m-upload/index'
import {reportMerchantApi} from '../../api/mine'

export default {
  components: {
    mUpload
  },
  data () {
    return {
      tabs: [
        '内容不实',
        '不结工资',
        '违法经营',
        '其他'
      ],
      loading: false,
      form: {}
    }
  },
  onLoad (options) {
    this.form = {
      activityId: Number(options.id),
      merchantName: decodeURIComponent(options.merchantName),
      reportType: '内容不实',
      images: '',
      content: ''
    }
  },
  methods: {
    submit () {
      const form = { ...this.form }
      if (!form.content) {
        return this.$Toast('warning', '请输入详细描述')
      }
      this.loading = true
      reportMerchantApi(form).then(() => {
        this.$Toast('success', '已提交，将尽快核实处理', () => {
          this.$toBack()
        })
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .opinion{
    min-height: 100vh;
    overflow: hidden;
    padding: 20rpx 30rpx;
    background: #f7f8f9;
    .form{
      border-radius: 8rpx;
      background: #fff;
      padding: 0 30rpx;
      h1 {
        color: #666;
        font-size: 30rpx;
        padding: 30rpx 0;
      }
      > div {
        padding: 30rpx 0 0;
        @extend .border-t;
        &.detail {
          padding-bottom: 30rpx;
        }
        /deep/ .m-textarea {
          height: 320rpx;
          background: #F8F7FC;
          border-radius: 8rpx;
        }
        label {
          color: #999;
          font-size: 30rpx;
          margin-bottom: 30rpx;
          @extend .y-center;
        }
        .btnTabs {
          padding: 0;
          flex-wrap: wrap;
          padding-bottom: 10rpx;
          button {
            width: 196rpx;
            flex: inherit;
            margin: 0 20rpx 20rpx 0;
            &:nth-child(3) {
              margin-right: 0;
            }
          }
        }
      }
    }
    .bottomBtn {
      background: transparent;
      position: static;
      margin-top: 120rpx;
      padding: 0;
    }
  }
</style>
