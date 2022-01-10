import {httpRequest} from '../utils/request.js'
// 小程序码
export const getQrCodeApi = (page, scene) => {
  return httpRequest('get', `/mp/system/getQrCode/${page}/${scene}`)
}
