import {httpRequest} from '../utils/request.js'
// 添加-评论的评论
export const replyCommentApi = (commentServiceID, data) => {
  return httpRequest('post', `/mp/comment/add2Comment/${commentServiceID}`, data)
}
// 删除
export const delCommentApi = (commentServiceID) => {
  return httpRequest('post', `/mp/comment/del/${commentServiceID}`)
}
// 添加-动态的评论
export const addCommentApi = (blogServiceID, data) => {
  return httpRequest('post', `/mp/comment/add2Merchant/${blogServiceID}`, data)
}
// 点赞触发器
export const likeCommentTriggerApi = (serviceID) => {
  return httpRequest('post', `/mp/comment/likeTrigger/${serviceID}`, {hideLoading: true})
}
// 列表-评论的评论
// 列表-评论的评论
export const getCommentListApi = (type, commentServiceID, data) => {
  return httpRequest('post', `/mp/comment/${!type ? 'listHotForMerchant' : 'listNewForMerchant'}/${commentServiceID}`, data)
}
// 验证是否可以评论
export const verifyCommentApi = (merchantServiceID) => {
  return httpRequest('post', `/mp/comment/verifyCommentCondition/${merchantServiceID}`)
}
