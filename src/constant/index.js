import Config from '../config/index'
const years = []
const months = []
const days = []
const hours = []
const minutes = []
const seconds = []
let uploadHost = Config.uploadUrl
export const defData = {
  uploadHost,
  dateTime: { years, months, days, hours, minutes, seconds },
  uploadUrl (module) {
    let uploadUrl = `${uploadHost}/file/upload?module=${module}`
    // if (process.env.NODE_ENV === 'development') {
    //   uploadUrl += '&debug=true'
    // }
    return uploadUrl
  }
}
// 生成时间日期
for (let i = new Date().getFullYear() - 1; i <= new Date().getFullYear() + 2; i++) {
  years.push({ label: i + '年', value: i + '-', name: i })
}
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = '0' + i
  }
  months.push({ label: i + '月', value: i + '-', name: i })
}
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = '0' + i
  }
  days.push({ label: i + '日 ', value: i + ' ', name: i })
}
for (let i = 0; i <= 23; i++) {
  if (i < 10) {
    i = '0' + i
  }
  hours.push({ label: i + '时', value: i + ':', name: i })
}
for (let i = 0; i <= 59; i++) {
  if (i < 10) {
    i = '0' + i
  }
  minutes.push({ label: i + '分', value: i, name: i })
}
for (let i = 0; i <= 59; i++) {
  if (i < 10) {
    i = '0' + i
  }
  seconds.push({ label: i + '秒', value: i, name: i })
}
