const D = new Date()
// 年
export const getYearOption = () => {
  const currentYear = D.getFullYear()
  let startYear = currentYear - 50
  const endYear = currentYear + 50
  const YearOption = []
  while (startYear <= endYear) {
    YearOption.push(String(startYear))
    startYear++
  }
  return YearOption
}

// 月
export const getMonthOption = () => {
  return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
}

// 日
export const getDayOption = (year = D.getFullYear(), month = D.getMonth() - 1) => {
  const TotalDay = new Date(Number(year), Number(month), 0).getDate()
  let startDay = 1
  const MonthOption = []
  while (startDay <= TotalDay) {
    if (startDay < 10) {
      startDay = `0${startDay}`
    }
    MonthOption.push(String(startDay))
    startDay++
  }
  return MonthOption
}

// 时
export const getHourOption = () => {
  return [
    '00', '01', '02', '03', '04', '05', '06', '07',
    '08', '09', '10', '11', '12', '13', '14', '15',
    '16', '17', '18', '19', '20', '21', '22', '22', '23'
  ]
}

// 分秒
export const getMSOption = () => {
  return [
    '00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
    '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
    '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
    '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'
  ]
}
