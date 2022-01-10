import {httpRequest} from '../utils/request.js'
// 全部一级分类，以及其子类
export const getCategoryListApi = () => {
  return httpRequest('post', '/mp/label/listTree')
}
// 全部一级分类
export const getCategoryLabelApi = () => {
  return httpRequest('post', '/mp/label/list')
}
// 添加🔥
export const approveMerchantApi = (data) => {
  return httpRequest('post', '/enterprise/create_authentication', data)
}
// 商家信息
export const getMerchantInfoApi = () => {
  return httpRequest('get', `/mp/merchantAudit/myMerchant`, {hideLoading: true})
}
// 商家详情
export const getMerchantDetailApi = (merchantServiceID) => {
  return httpRequest('get', `/mp/merchant/detail/${merchantServiceID}`)
}
// 活动列表
export const getActivityListApi = (data, isMe) => {
  return httpRequest('post', `/mp/activity/list/all/merchant${!isMe ? `/${data.merchantServiceID}` : ''}`, data)
}
// 关注触发器
export const focusMerchantApi = (merchantServiceID) => {
  return httpRequest('post', `/mp/merchant/collectTrigger/${merchantServiceID}`)
}
// 想去触发器
export const wantTriggerApi = (merchantServiceID) => {
  return httpRequest('post', `/mp/merchant/wantTrigger/${merchantServiceID}`)
}
