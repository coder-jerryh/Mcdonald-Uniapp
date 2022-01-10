import Vue from 'vue'
import { QQMapWX } from './wx-jssdk'
import config from '../config'
import {getAddress} from '../utils/filters'
// 获取位置
export const getLocation = () => {
  return new Promise((resolve) => {
    uni.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success (res) {
        const { latitude, longitude } = res
        const qqmapsdk = new QQMapWX({
          key: config.qqMapKey
        })
        const location = { latitude, longitude }
        qqmapsdk.reverseGeocoder({
          location,
          success ({ result }) {
            console.log(result)
            resolve({
              ...result,
              ...location,
              city: result.ad_info.city.replace('市', '')
            })
          },
          fail () {
            Vue.prototype.$Toast('warning', '获取地理位置信息失败')
          }
        })
      },
      fail (res) {
        if (res.errMsg.includes('auth')) {
          Vue.prototype.$Confirm(
            '提示',
            '获取定位失败，请打开设置开启定位',
            '打开设置',
            () => {
              uni.openSetting()
            }
          )
        }
      }
    })
  })
}

// 打开地图
export const openLocation = ({latitude, longitude, name, address}) => {
  return new Promise((resolve) => {
    uni.openLocation({
      scale: 28,
      latitude: Number(latitude),
      longitude: Number(longitude),
      name,
      address,
      success: res => {
        resolve(res)
      }
    })
  })
}

// 选择位置
export const selectLocation = (location) => {
  const latitude = location.latitude
  const longitude = location.longitude
  let latLon = {}
  if (latitude && longitude) {
    latLon = {latitude, longitude}
  }
  return new Promise((resolve, reject) => {
    uni.chooseLocation({
      ...latLon,
      success (res) {
        // address: "四川省成都市双流区顺城街27号"
        // errMsg: "chooseLocation:ok"
        // latitude: 30.574359
        // longitude: 103.922807
        // name: "中国建设银行(双流支行)"
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.address + res.name,
          addressList: getAddress(res.address)
        })
      },
      fail (res) {
        if (res.errMsg.includes('auth')) {
          reject(res)
          Vue.prototype.$Confirm(
            '提示',
            '获取定位失败，请打开设置开启定位',
            '打开设置',
            () => {
              uni.openSetting()
            }
          )
        }
      }
    })
  })
}
