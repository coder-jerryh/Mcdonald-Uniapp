import { httpRequest } from '../utils/request.js'

// 充值
export const topUpApi = (data) => {
  return httpRequest('post', `/enterprise/recharge`, data)
}
// 提现👌
export const withdrawlApi = (data) => {
  return httpRequest('post', `/user/withdrawal`, data)
}
// 用户最新基本信息👌
export const getUserInfoApi = () => {
  return httpRequest('post', '/user/get_user_info', {hideLoading: true})
}
// 用户最新基本信息👌
export const editUserInfoApi = (data) => {
  return httpRequest('post', '/user/set_user_info', data)
}
// 我的活动列表👌
export const getMyActivityListApi = (data) => {
  return httpRequest('post', '/user/extension_list', data)
}
// 举报商家
export const reportMerchantApi = (data) => {
  return httpRequest('post', '/user/report_activity', data)
}
// 登录
export const loginApi = (data) => {
  return httpRequest('post', '/user/login', data)
}
// 注册
export const registerLoginApi = (data) => {
  return httpRequest('post', '/user/register', data)
}
// 绑定手机
export const bindPhoneApi = (data) => {
  return httpRequest('post', '/user/set_phone', data)
}

/** @流水 **/
// 流水列表👌
export const getFinancialListApi = (data) => {
  return httpRequest('post', `/user/financial_list`, data)
}
// 流水明细👌
export const getFinancialDetailApi = (data) => {
  return httpRequest('post', `/user/financial_detail`, data)
}

/** @提现 **/
// 绑定支付宝 👌
export const setAlipayInfoApi = (data) => {
  return httpRequest('post', `/user/set_alipay_info`, data)
}

/** @会员 **/
// 会员信息👌
export const getVipInfoApi = () => {
  return httpRequest('post', `/get_vip_list`)
}
// 余额开通会员👌
export const openVipApi = (data) => {
  return httpRequest('post', `/user/open_vip`, data)
}
// 购买会员👌
export const buyVipApi = (data) => {
  return httpRequest('post', `/user/recharge_and_open_vip`, data)
}

/** @隐私 **/
// 获取隐私
export const getPrivacyApi = () => {
  return httpRequest('post', '/get_privacy_policy')
}

/** @协议 **/
// 获取协议
export const getAgreementApi = () => {
  return httpRequest('post', '/get_service_to_user')
}

/** @关于我们 **/
// 获取关于我们
export const getAboutUsApi = () => {
  return httpRequest('post', '/get_about_user')
}

// ----------------------------------

// 详情
export const getBannerApi = (type) => {
  return httpRequest('get', `/mp/banner/randomBanner/${type}`)
}
// 获奖记录
export const getMyPrizeListApi = (data) => {
  return httpRequest('post', '/mp/u/lottery/list/log/win', data)
}
// 列表-用户-我参与的
export const getMyjoinedListApi = (data) => {
  return httpRequest('post', '/mp/activity/list/joined', data)
}
// 列表-想去清单
export const getMyWantListApi = (data) => {
  return httpRequest('post', '/mp/merchant/listForWant', data)
}
// ---------- 拼多多订单 ----------
// 列表-我的订单
export const getMallOrderListApi = (data) => {
  return httpRequest('post', '/mp/pdd/list/order', data)
}
