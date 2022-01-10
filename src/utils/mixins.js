import { mapMutations, mapActions, mapState } from 'vuex'
import {getSystemMsgListApi} from '../api/msg'
export const mixins = {
  options: {
    styleIsolation: 'shared'
  },
  data () {
    return {
      // 系统最新消息
      newSystemMsg: {},
      // 消息数量
      unReadCount: 0,
      messageIds: {
        // 活动和外卖
        applyActivity: [
          'c8j1bYJdJVNlHRaxSX9_2OuUJyGXxfwweUd_0593KGw',
          'qXNSCf5II31SAurXVhnmecat5hJX9mK9XZBpvp9CuY8'
        ],
        takeout: ['qXNSCf5II31SAurXVhnmecat5hJX9mK9XZBpvp9CuY8']
      }
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'config',
      'shareInfo',
      'keyboardHeight',
      'userLocation'
    ]),
    // 是否登录
    isLogin () {
      return Boolean(this.userInfo && this.userInfo.token)
    },
    shareTitle () {
      return `${this.userInfo.nickname || ''}邀请你使用同城圈`
    },
    // 是否Vip
    isVip () {
      return this.isLogin && this.userInfo.vip_id !== 4
    },
    companyType () {
      return {
        1: '个人商家',
        2: '个体户商家',
        3: '企业商家'
      }[this.userInfo.authentication_type]
    }
  },
  onReachBottom () {
    uni.$emit('onReachBottom')
  },
  methods: {
    ...mapActions([
      'getUserInfo',
      'getUserLocation'
    ]),
    ...mapMutations([
      'setUserInfo',
      'setShare',
      'setKeyboardHeight',
      'saveUserLocation'
    ]),
    // 用户权限验证
    verifyUser (cb, type) {
      // 未登录
      if (!this.isLogin) {
        return this.$toUrl('/pages/login/index')
      }

      if (type === 'isMerchant') {
        // 审核中
        if (this.userInfo.status === 1) {
          return this.$Toast('warning', '认证信息审核中…')
        }
        // 不是商家
        if (!this.userInfo.status) {
          return this.$Confirm(
            '提示',
            '认证商家信息后，才能发布活动噢~',
            '去认证',
            () => {
            },
            '稍后再去'
          )
        }
      }
      cb()
    },
    // 获取用户勾选状态
    getRequestMsgStatus () {
      const that = this
      wx.getSetting({
        withSubscriptions: true,
        success (res) {
          // 认证ID只需要一次
          // const itemSettings = Object.values(res.subscriptionsSetting.itemSettings).filter(messageId => {
          //   return messageId != that.messageIds.audit[0]
          // })
          const itemSettings = res.subscriptionsSetting.itemSettings || []
          const mainSwitch = itemSettings[that.messageIds.applyActivity[0]] === 'accept'
          uni.setStorageSync('mainSwitch', mainSwitch)
        },
        fail () {
          uni.setStorageSync('mainSwitch', false)
        }
      })
    },
    // 订阅消息
    requestMessage (messageType, needRequest = false) {
      const messageId = this.messageIds[messageType]
      const that = this
      return new Promise((resolve, reject) => {
        if (uni.getStorageSync('mainSwitch')) {
          resolve()
          wx.requestSubscribeMessage({
            tmplIds: messageId
          })
        } else if (needRequest) {
          wx.requestSubscribeMessage({
            tmplIds: messageId,
            success () {
              resolve()
              if (!uni.getStorageSync('mainSwitch')) {
                // 获取用户勾选状态
                that.getRequestMsgStatus()
              }
            },
            fail (res) {
              reject(res)
            }
          })
        } else {
          resolve()
        }
      })
    },
    // 消息数量
    getMsgCount () {
      // unReadCountApi().then(({ data }) => {
      //   if (data) {
      //     uni.setTabBarBadge({
      //       index: 2,
      //       text: data.toString()
      //     })
      //   } else {
      //     uni.removeTabBarBadge({
      //       index: 2
      //     })
      //   }
      // })
    },
    getSystemMsgList () {
      getSystemMsgListApi({page: 1, pageSize: 1}).then(({data}) => {
        this.newSystemMsg = data.list.find(item => !item.is_read)
        this.unReadCount = data.total
        // 消息数量
        if (data.total) {
          uni.setTabBarBadge({
            index: 2,
            text: data.total.toString()
          })
        } else {
          uni.removeTabBarBadge({
            index: 2
          })
        }
      })
    }
  }
}
