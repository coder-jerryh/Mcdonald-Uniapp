import {httpRequest} from '../utils/request.js'
// 统计数据列表
export const getDataListApi = (data) => {
  return httpRequest('post', `/enterprise/data_list`, data)
}
// 统计数据列表
export const getStatDataApi = (data) => {
  return httpRequest('post', `/enterprise/get_statistics_data`, data)
}
// 流水列表
export const getFinancialListApi = (data) => {
  return httpRequest('post', `/enterprise/financial_list`, data)
}
