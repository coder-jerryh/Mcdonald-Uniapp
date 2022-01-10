<template>
  <div class='login'>
    <template v-if='step == 1'>
      <img src='../../assets/logo.jpg'>
      <h2>同城圈</h2>
      <button @click='getUserProfile'><i class="iconfont icon-wx"></i>微信登录</button>
    </template>
    <template v-if='step == 2'>
      <m-image :src='baseInfo.avatar'/>
      <h2>{{baseInfo.nickname}}</h2>
      <p>为了你的账号安全，需要授权手机号</p>
      <button class="getPhone" open-type='getPhoneNumber' @getphonenumber='getPhoneNumber'><i class="iconfont icon-mobile"></i>点击授权</button>
    </template>
    <!-- 协议 -->
    <!-- <footer @click="form.agreeProtocolFlag = 1">
      <span>
        <i v-if="form.agreeProtocolFlag" class="iconfont icon-radios"></i>
        <i v-else class="iconfont icon-radio"></i>
      </span>
      <p>
        <span>我已阅读并同意</span>
        <a @click.stop="readAgreement('communityRule')">《同城圈社区管理规范》</a>
        <span>和</span>
        <a @click.stop="readAgreement('privacyRule')">《用户隐私保护政策》</a>
      </p>
    </footer> -->
  </div>
</template>

<script>
import {loginApi, bindPhoneApi} from '../../api/mine'
export default {
  data () {
    return {
      step: 1,
      baseInfo: {},
      communityRule: '',
      titles: {
        communityRule: '同城圈社区管理规范',
        privacyRule: '用户隐私保护政策'
      },
      privacyRule: ''
    }
  },
  onLoad (options) {
    this.step = Number(options.step) || 1
    // 未绑定手机号
    if (this.step === 2) {
      this.getWxCode()
      this.baseInfo = {...this.userInfo}
    }
    // this.getAgreement()
  },
  methods: {
    // 获取用户信息
    getUserProfile () {
      // if (!this.form.agreeProtocolFlag) {
      //   return this.$Toast('warning', '请先阅读社区管理规范与用户隐私协议')
      // }
      this.getWxCode()
      let that = this
      wx.getUserProfile({
        desc: '微信登录',
        success: (res) => {
          if (res.errMsg === 'getUserProfile:ok') {
            this.$Toast('loading', '登录中…')
            const {nickName, avatarUrl, country, gender} = res.userInfo
            const form = {
              code: that.code,
              encryptedData: res.encryptedData,
              iv: res.iv,
              nickName,
              cover: avatarUrl,
              address: country,
              sex: gender
            }
            loginApi(form).then(({data}) => {
              that.baseInfo = {
                ...data,
                token: data.Token,
                avatar: avatarUrl,
                nickname: nickName,
                phone: data.UserInfo.phone
              }
              // 已绑定手机号直接登录
              if (data.UserInfo.phone) {
                that.login()
              } else {
                // 否则需要绑定手机号
                uni.hideLoading()
                that.step = 2
              }
            }).finally(() => {
              this.getWxCode()
            })
          }
        }
      })
    },
    // 获取手机号
    getPhoneNumber (e) {
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        this.$Toast('loading', '绑定中…')
        const form = {
          token: this.baseInfo.token,
          code: this.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        }
        bindPhoneApi(form).then(({data}) => {
          this.baseInfo.phone = data
          this.login()
        })
      }
    },
    // 获取登录
    login () {
      uni.setStorageSync('token', this.baseInfo.Token)
      uni.setStorageSync('fromLogin', true)
      this.setUserInfo(this.baseInfo)
      this.getUserInfo()
      this.$toBack()
    },
    // 获取code
    getWxCode () {
      let that = this
      uni.login({
        success ({ code }) {
          if (code) that.code = code
        },
        fail () {
          uni.showToast({
            title: '授权失败',
            icon: 'none',
            duration: 3000
          })
        }
      })
    },
    // getAgreement () {
    //   getAgreementApi().then(({data}) => {
    //     this.communityRule = data.communityRule
    //     this.privacyRule = data.privacyRule
    //   })
    // },
    readAgreement (key) {
      this.$toUrl(`/pages/common/editorPage?title=${this.titles[key]}`)
      uni.setStorageSync('editorContent', this[key])
    }
  }
}
</script>

<style lang='scss' scoped>
  .login{
    min-height: 100vh;
    background: #fff;
    @extend .xy-center;
    justify-content: flex-start;
    img, /deep/ .m-image{
      margin-top: 18vh;
      width: 200rpx;
      height: 200rpx;
      border-radius: 50%;
    }
    h2{
      font-size: 32upx;
      color: #333;
      margin-top: 20upx;
      margin-bottom: 180upx;
    }
    p {
      color: #666;
      font-size: 28rpx;
      margin-top: -40rpx;
    }
    button{
      margin-top: 30upx;
      width: 520upx;
      height: 88upx;
      border-radius: 16upx;
      background: $bgColor;
      font-size: 30upx;
      color: #fff;
      .icon-wx{
        margin-right: 8rpx;
        font-size: 30rpx;
      }
      &.getPhone {
        background: $bgColor;
        .icon-mobile{
          position: relative;
          top: -1rpx;
          margin-right: 6rpx;
          font-size: 42rpx;
        }
      }
    }
    // footer {
    //   width: 80%;
    //   display: flex;
    //   margin-top: 100upx;
    //   i{
    //     font-size: 36upx;
    //     margin-right: 10upx;
    //     position: relative;
    //     top: 2upx;
    //     color: #aaa;
    //     &.icon-radios{
    //       color: $main;
    //     }
    //   }
    //   p{
    //     line-height: 1.5;
    //     @extend .y-center;
    //     font-size: 28upx;
    //     flex-wrap: wrap;
    //     span{
    //       color: #444;
    //     }
    //     a{
    //       display: inline;
    //       color: $main;
    //     }
    //   }
    // }
  }
</style>
