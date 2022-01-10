import Vue from 'vue'
import Config from '../config/index'
import store from '../store/index'
import { computedDate } from './filters'
const that = Vue.prototype
const preventHandle = (data) => {
  const now = new Date().getTime()
  const { reason, time } = JSON.parse(data.message)
  that.$Alert(
    '禁用提示',
    `你因违反平台规则，暂无法操作\n原因：${reason}\n距离解除还有：${computedDate(time - now)}`,
    '我知道了'
  )
}
// 订阅者
let subscribers = []
// 添加缓存接口
const addSubscriber = (method, url, data, callback) => {
  subscribers.push({ method, url, data, callback })
  if (subscribers.length === 1) {
    store.dispatch('login').then(() => {
      that.$Toast('loading', '正在加载')
      onAccessTokenFetched()
    })
  }
}

// 执行缓存接口
const onAccessTokenFetched = () => {
  subscribers.forEach(({ method, url, data, callback }) => {
    httpRequest(method, url, data || {}, callback)
  })
  // 清空
  subscribers = []
  uni.hideLoading()
}
let loadingTimer = null
// 是否打开了loading
let isShowLoading = false
export const httpRequest = (method, url, params = {}, callback) => {
  params.token = params.token || uni.getStorageSync('token')
  isShowLoading = false
  if (!params.hideLoading && !loadingTimer) {
    loadingTimer = setTimeout(() => {
      isShowLoading = true
      that.$Toast('loading', '正在加载')
    }, 500)
  }
  return new Promise((resolve, reject) => {
    if (!url.includes('http')) {
      url = Config.api + url
    }
    uni.request({
      url,
      data: params,
      method,
      timeout: 10000,
      header: {
        // token: data.token || uni.getStorageSync('token')
      },
      success ({ data }) {
        clearTimeout(loadingTimer)
        if (callback) return callback(data)
        switch (data.code) {
          case 0:
            isShowLoading && uni.hideLoading()
            resolve(data)
            return
          // 登录过期
          case -2:
            // 没有token就触发重新登录
            if (!uni.getStorageSync('token')) {
              // 否则提示用户重新登录一次
              store.commit('setUserInfo', null)
              that.$Alert(
                '提示',
                '登录已过期，请重新登录~',
                '去登录',
                () => {
                  that.$toUrl('/pages/login/index')
                }
              )
              return
            }
            // 移除之前的token
            delete params.token
            addSubscriber(method, url, params, resolve)
            return
          case 601:
            preventHandle(data)
            reject(data.code)
            return
          case 604:
            preventHandle(data)
            reject(data.code)
            return
          case 606:
            preventHandle(data)
            reject(data.code)
            return
          default:
            // 控制只弹一次弹窗
            if (store.state.alertFlag) return
            store.commit('changeAlert', true)
            that.$Alert(
              '提示',
              data.message || '系统繁忙',
              '我知道了',
              () => {
                store.commit('changeAlert', false)
              }
            )
            reject(data.code)
        }
      },
      fail (res) {
        uni.hideLoading()
        reject(res)
      },
      complete () {
        clearTimeout(loadingTimer)
        loadingTimer = null
      }
    })
  })
}
