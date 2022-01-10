import { defData } from '../constant'
import Vue from 'vue'
const VideoType = [
  'avi', 'wmv', 'mpg', 'mpeg', 'mov', 'rm', 'ram', 'swf', 'flv', 'mp4', 'wma', 'avi', 'rm', 'rmvb', 'flv', 'mpg', 'mkv'
]
// 两个数组对象根据某属性取不同项
export const twoArrFilter = (arr1, arr2, type) => {
  let arr = []
  for (let item1 of arr1) {
    let isExist = false
    for (let item2 of arr2) {
      if (item1[type] === item2[type]) {
        isExist = true
        break
      }
    }
    if (!isExist) {
      arr.push(item1)
    }
  }
  return arr
}
// 年月日转时间戳
export const timeFilter = (time) => {
  return new Date(time.replace(/-/g, '/')).getTime()
}
// 时间戳转事件
export const dateFilter = (time, format = 'yyyy-MM-dd hh:mm:ss') => {
  if (time !== 'now' && String(time).length < 13) {
    time = time * 1000
  }
  return time === 'now' ? new Date().Format(format) : new Date(time).Format(format)
}
// 日期距离当前时间
export const dateFromNow = (date) => {
  if (!date) return ''
  // 时间差
  const second = (new Date().getTime() - date) / 1000
  // 今天过了多少秒
  const timenow = new Date()
  const todaySecond = timenow.getHours() * 3600 + timenow.getMinutes() * 60 + timenow.getSeconds()
  // 返回的时间
  let time = null
  // 小于60秒
  if (second < 60) {
    time = '刚刚'
  } else if (second >= 60 && second < 60 * 60) {
    // 大于1分钟 小于1小时
    time = Math.round(second / 60) + '分钟前'
  } else if (second >= 60 * 60 && second < todaySecond) {
    // 大于1小时 小于今天
    const hour = Math.round((second / 60) / 60)
    if (hour <= 12) {
      time = hour + '小时前'
    } else {
      time = '今天 ' + dateFilter(date, 'hh:mm')
    }
  } else if (second >= todaySecond && second <= (60 * 60 * 24 + todaySecond)) {
    // 大于今天，小于昨天
    time = '昨天 ' + dateFilter(date, 'hh:mm')
  } else {
    time = dateFilter(date, 'MM-dd hh:mm')
  }
  return time
}
export const computedTime = (time, splitTime = false) => {
  let d = Math.floor(time / (24 * 60 * 60 * 1000))
  let leave1 = time % (24 * 60 * 60 * 1000)
  let h = Math.floor(leave1 / (60 * 60 * 1000))
  let leave2 = leave1 % (60 * 60 * 1000)
  let m = Math.floor(leave2 / (60 * 1000))
  let leave3 = leave2 % (60 * 1000)
  let s = Math.round(leave3 / 1000)
  d = d < 10 ? '0' + d : d
  h = h < 10 ? '0' + h : h
  m = m < 10 ? '0' + m : m
  s = s < 10 ? '0' + s : s
  if (splitTime) {
    return {
      d, h, m, s
    }
  }
  let str = d + '天' + h + '时' + m + '分'/** @ + s + '秒' **/
  if (d === '00') {
    str = h + '时' + m + '分'/** @ + s + '秒' **/
    if (h === '00') {
      str = m + '分'/** @ + s + '秒' **/
      if (m === '00') {
        str = s + '秒'
      }
    }
  }
  return str
}
// 经纬度计算距离
export const getDistance = (location1 = {}, location2 = {}) => {
  const lat1 = location1.latitude || 0
  const lng1 = location1.longitude || 0
  const lat2 = location2.latitude || 0
  const lng2 = location2.longitude || 0
  let radLat1 = lat1 * Math.PI / 180.0
  let radLat2 = lat2 * Math.PI / 180.0
  let a = radLat1 - radLat2
  let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
  s = s * 6378.137// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000
  if (s < 1) {
    return (s * 1000).toFixed(1) + 'm'
  } else {
    return s.toFixed(1) + 'km'
  }
}
// 是否是视频
export const isVideo = (url) => {
  if (!url) return
  return VideoType.includes(url.split('.').pop())
}
// 是否有视频
export const hasVideo = (urls) => {
  if (!urls) return
  return urls.some(url => isVideo(url))
}
export const computedDate = (time, splitTime = false) => {
  let d = Math.floor(time / (24 * 60 * 60 * 1000))
  let leave1 = time % (24 * 60 * 60 * 1000)
  let h = Math.floor(leave1 / (60 * 60 * 1000))
  let leave2 = leave1 % (60 * 60 * 1000)
  let m = Math.floor(leave2 / (60 * 1000))
  let leave3 = leave2 % (60 * 1000)
  let s = Math.round(leave3 / 1000)
  d = d < 10 ? '0' + d : d
  h = h < 10 ? '0' + h : h
  m = m < 10 ? '0' + m : m
  s = s < 10 ? '0' + s : s
  if (splitTime) {
    return {
      d, h, m, s
    }
  }
  let str = d + '天' + h + '时' + m + '分' + s + '秒'
  if (d === '00') {
    str = h + '时' + m + '分' + s + '秒'
    if (h === '00') {
      str = m + '分' + s + '秒'
      if (m === '00') {
        str = s + '秒'
      }
    }
  }
  return str
}
// 转换query
export const formatQuery = (query, joinMode = '&') => {
  const newQuery = {}
  const queryArr = []
  Object.keys(query).sort().forEach(key => {
    newQuery[key] = query[key]
  })
  for (const key in newQuery) {
    if (key !== 'totalNum' && ![null, undefined].includes(newQuery[key])) {
      queryArr.push(`${key}${joinMode && '='}${newQuery[key]}`)
    }
  }
  return queryArr.join(joinMode)
}
export const getDateArr = (time) => {
  // time存在就获取传入时间戳，否则获取当前时间的时间戳
  time = time ? new Date(time) : new Date()
  let year = time.getFullYear()
  let month = addZero(time.getMonth() + 1)
  let date = addZero(time.getDate())
  let hour = addZero(time.getHours())
  let minute = addZero(time.getMinutes())
  function addZero (data) {
    return data < 10 ? '0' + data : data
  }
  return [year, month, date, hour, minute]
}
// 根据时间戳，返回该时间在dateTime中的下标组和标准日期(2018-08-08 10:08)
export const dateTimeEcho = (dateTime) => {
  let timeArr = getDateArr(dateTime, 'Array') // 将时间戳转成时间组[2018, '08', '08', 10, '08']
  let time = { index: [], label: '' } // 要返回的数据
  timeArr.map((item, index) => {
    defData.dateTime[index].map((date, i) => {
      if (Number(date.name) === Number(item)) {
        time.label += date.value
        time.index.push(i)
      }
    })
  })
  return time
}
// 筛选语言
export const filterLanguage = (language) => {
  if (language.includes('en') || language.includes('En')) {
    return 'En'
  } else if (language.includes('de') || language.includes('De')) {
    return 'De'
  } else {
    return 'Zh'
  }
}
// 截取长度
export const reBytesStr = (str, len) => {
  if ((!str && typeof (str) !== 'undefined')) {
    return ''
  }
  var num = 0
  var str1 = str
  for (var i = 0, lens = str1.length; i < lens; i++) {
    num += ((str1.charCodeAt(i) > 255) ? 2 : 1)
    if (num > len) {
      break
    } else {
      str = str1.substring(0, i + 1)
    }
  }
  return str
}
// 截取字符串真实长度
export const getStrTrueLength = (str) => {
  var len = str.length
  var trueLen = 0
  for (var x = 0; x < len; x++) {
    if (str.charCodeAt(x) > 128) {
      trueLen += 2
    } else {
      trueLen += 1
    }
  }
  return trueLen
}
// 复制
export function copyText (data, tips = '复制成功！') {
  return new Promise((resolve, reject) => {
    // 小程序
    // #ifndef H5
    uni.setClipboardData({
      data,
      success: () => {
        Vue.prototype.$Toast('success', tips)
      }
    })
    // #endif

    // H5
    // #ifdef H5
    // navigator.clipboard.writeText(data).then(success).catch(fail);
    const textarea = document.createElement('textarea')
    textarea.value = data
    textarea.readOnly = 'readOnly'
    document.body.appendChild(textarea)
    textarea.select()
    textarea.setSelectionRange(0, data.length)
    document.execCommand('copy')
    textarea.remove()
    Vue.prototype.$Toast('success', tips)
    // #endif
  })
}

// 设置tabbar
export const setTabBarItem = (that, type) => {
  // onLaunch 首次进入
  if (uni.getStorageSync('refreshTabbar') || type === 'onLaunch') {
    const userType = uni.getStorageSync('userType') || 'default'
    const tabbars = {
      default: ['接单/取单', '订单/排单', '设置/统计'],
      merchant: ['接单处理', '订单管理', '设置'],
      deliveryman: ['取单处理', '排单', '配送统计']
    }
    uni.setTabBarItem({
      index: 0,
      text: that.$t(tabbars[userType][0])
    })
    uni.setTabBarItem({
      index: 1,
      text: that.$t(tabbars[userType][1])
    })
    uni.setTabBarItem({
      index: 2,
      text: that.$t(tabbars[userType][2]),
      'selectedIconPath': `${that.$platform === 'h5' ? 'm/' : ''}static/${userType === 'merchant' ? 'sets' : 'stats'}.png`,
      'iconPath': `${that.$platform === 'h5' ? 'm/' : ''}static/${userType === 'merchant' ? 'set' : 'stat'}.png`
    })
    uni.removeStorageSync('refreshTabbar')
  }
}
export const getTimeList = (hours, step) => {
  var minutes = 60
  var timeArr = []
  for (var i = 0; i < hours; i++) {
    var str = ''
    if (i < 10) {
      str = 0 + '' + i
    } else {
      str = '' + i
    }
    for (var j = 0; j < minutes; j++) {
      if (j % step === 0) {
        var s = j < 10 ? ':' + 0 + '' + j : ':' + j
        s = str + s
        timeArr.push(s)
      }
    }
  }
  return timeArr
}

export const getAddress = (data, type = '') => {
  var reg = /.+?(省|市|自治区|自治州|县|区)/g
  const addressList = data.match(reg)
  if (!type) {
    if (!addressList[1].includes('市')) {
      addressList[1] = addressList[0]
    }
    return addressList
  } else if (type === 'city') {
    return addressList[1]
  }
}

// 转换数据
export const keyToUpperCase = (data = {}) => {
  const newData = {}
  // 分页空字段排除
  for (const key in data) {
    const value = data[key]
    if (key !== 'totalNum' && value !== '') {
      const newKey = key.replace(/_(\w)/g, (all, letter) => letter.toUpperCase())
      newData[newKey] = value
    }
  }
  return newData
}
