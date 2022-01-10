import { httpRequest } from '../utils/request.js'

// 消息列表
export const getSystemMsgListApi = (data) => {
  return httpRequest('post', `/user/get_message_list`, data)
}
// 未读消息数量
export const getUnreadCountApi = (data) => {
  return httpRequest('post', `/user/get_no_read_number`, data)
}
// 读消息
export const readSystemMsgApi = (data) => {
  return httpRequest('post', `/user/get_message_detail`, data)
}
