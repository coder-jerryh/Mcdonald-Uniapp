<template>
  <div class="share" @touchmove.stop.prevent>
    <div class="mask" :class="{showMask: show}" @click="show = false"></div>
    <div class="centerShow" :class="{show}">
      <i class="iconfont icon-round-close" @click="show = false"></i>
      <div class="avatar">
        <m-image :src="userInfo.avatar"/>
      </div>
      <img class="qrCode" src="../../assets/image/walletBg.png" alt="">
      <span>扫描二维码，在同城圈找到我</span>
      <p>
        <i class="square"></i>
        <span>邀请成功立得30元</span>
        <i class="square"></i>
      </p>
    </div>
    <div class="btns" :class="{show}">
      <button open-type='share' :data-item='{...currentItem, shareCode}'>
        <img src="../../assets/image/share1.png">
        <span>分享给好友</span>
      </button>
      <button @click="canvasImage">
        <img src="../../assets/image/share2.png">
        <span>保存到本地</span>
      </button>
    </div>
    <canvas canvas-id="mycanvas" v-show="canvasShow"></canvas>
  </div>
</template>

<script>
import {getStrTrueLength} from '../../utils/filters'
import {getShareCodeApi} from '../../api/activity'

export default {
  props: {
    type: String
  },
  data () {
    return {
      canvasShow: true,
      currentItem: {
        pictures: []
      },
      show: false,
      avatar: '',
      activityPic: '',
      activityPicInfo: {},
      qrCodeUrl: '',
      shareCode: '',
      isHomePage: false
    }
  },
  created () {
    const routes = getCurrentPages() // 获取当前打开过的页面路由数组
    const route = routes[routes.length - 1].route
    this.isHomePage = route.includes('/homePage/index')
  },
  methods: {
    showPopup (item) {
      this.$Toast('loading', '加载中…')
      this.currentItem = {...item}
      this.getShareCode()
      this.show = true
    },
    toTurn () {
      this.$toUrl(`/pages/homePage/sendBlog/turnBlog?type=${this.type}`)
      this.show = false
    },
    downloadImage () {
      return new Promise(resolve => {
        const that = this
        // 头像
        uni.downloadFile({
          url: this.userInfo.avatar,
          success: (res) => {
            that.avatar = res.tempFilePath
          }
        })
        // 活动图
        uni.downloadFile({
          url: this.hasHttp(this.currentItem.pictures[0]),
          success: (res) => {
            that.activityPic = res.tempFilePath
            uni.getImageInfo({
              src: res.tempFilePath,
              success: (res) => {
                resolve()
                that.activityPicInfo = res
              }
            })
          }
        })
      })
    },
    getShareCode () {
      getShareCodeApi(this.currentItem.serviceID).then(({data}) => {
        this.shareCode = data
        // 获得小程序码
        this.createQrCode()
      })
    },
    // 获得小程序码
    createQrCode () {
      const that = this
      wx.request({
        url: `${this.config.api}/mp/system/getQrCode`, // 获取图片的URL
        method: 'post',
        data: {
          page: '/pages/homePage/detail/index',
          serviceID: this.currentItem.serviceID,
          activityType: 'lottery',
          shareCode: this.shareCode
        },
        responseType: 'arraybuffer',
        success (res) {
          // buffer文件 => file文件
          // 文件管理器
          const fsm = wx.getFileSystemManager()
          // 文件后缀
          const format = 'png'
          // 获取当前时间戳用于区分小程序码，防止多次写进的小程序码图片都一样，建议通过不同的列表ID来区分不同的小程序码
          const timestamp = new Date().getTime()
          // base转二进制
          const buffer = res.data
          // 文件名
          const filePath = `${wx.env.USER_DATA_PATH}/${timestamp}mpCode.${format}`
          fsm.writeFile({
            filePath,
            data: buffer,
            encoding: 'binary',
            success () {
              // 读取图片
              wx.getImageInfo({
                src: filePath,
                success ({path}) {
                  that.qrCodeUrl = path
                  uni.hideLoading()
                }
              })
            }
          })
        }
      })
    },
    canvasImage () {
      uni.showLoading({
        title: '海报生成中…',
        mask: true
      })
      this.downloadImage().then(() => {
        const that = this
        const canvasWidth = 580
        const canvasHeight = 930

        const myCanvas = uni.createCanvasContext('mycanvas', this)

        // 背景色
        myCanvas.setFillStyle('#FF624A')
        myCanvas.fillRect(0, 0, canvasWidth, canvasHeight)
        myCanvas.closePath()

        // 白色区域
        const whiteBlackWidth = 530
        const whiteBlackHeight = 556
        myCanvas.setFillStyle('#FFFFFF')
        myCanvas.fillRect(canvasWidth / 2 - whiteBlackWidth / 2, 250, whiteBlackWidth, whiteBlackHeight)
        myCanvas.closePath()

        // 头像
        const avatarWH = 106
        myCanvas.save()
        myCanvas.beginPath()
        myCanvas.arc(canvasWidth / 2, avatarWH / 2 + 28, avatarWH / 2, 0, Math.PI * 2, false)
        myCanvas.fillStyle = '#FFFFFF'
        myCanvas.fill()
        myCanvas.clip()
        myCanvas.drawImage(this.avatar, canvasWidth / 2 - avatarWH / 2, 28, avatarWH, avatarWH)
        myCanvas.restore()

        // 昵称
        const nickname = this.userInfo.nickname
        myCanvas.setFillStyle('#FFFFFF')
        myCanvas.setFontSize(30)
        myCanvas.fillText(nickname, canvasWidth / 2 - myCanvas.measureText(nickname).width / 2, 175)

        // 邀请你参加【品牌名称】的抽奖活动
        const text = `邀请你参加【${this.currentItem.merchant.shopName}】的抽奖活动`
        myCanvas.setFontSize(24)
        myCanvas.setFillStyle('#FFFFFF')
        myCanvas.fillText(text, canvasWidth / 2 - myCanvas.measureText(text).width / 2, 220)

        // 活动图
        const activityPicWH = 258
        var imgRect = this.containImg(canvasWidth / 2 - activityPicWH / 2, 270, activityPicWH, activityPicWH, this.activityPicInfo.width, this.activityPicInfo.height)
        myCanvas.drawImage(this.activityPic, imgRect.dx, imgRect.dy, imgRect.dWidth, imgRect.dHeight)

        // 活动标题
        const title = this.currentItem.title
        myCanvas.setFillStyle('#222222')
        myCanvas.setFontSize(28)
        this.writeTextOnCanvas(myCanvas, 40, 36, title, 50, 570)

        // 开奖时间
        const date = `开奖时间：${this.$dateFilter(this.currentItem.endTime, 'MM月dd日 hh:mm')}开奖`
        myCanvas.setFontSize(24)
        myCanvas.setFillStyle('#999999')
        myCanvas.fillText(date, 50, 592 + 28 * Math.ceil(getStrTrueLength(title) / 35 * 1.25))

        // 二维码大小
        const qrCodeWH = 100
        // 开奖时间
        const tips = '同城圈-长按扫码参与活动'
        myCanvas.setFontSize(24)
        myCanvas.setFillStyle('#999999')
        myCanvas.fillText(tips, 50, canvasHeight - 140 - qrCodeWH / 2 + 12)

        // 二维码
        myCanvas.drawImage(this.qrCodeUrl, canvasWidth - qrCodeWH - 40, canvasHeight - 140 - qrCodeWH, qrCodeWH, qrCodeWH)

        // 分割线
        myCanvas.beginPath()
        myCanvas.moveTo(25, canvasHeight - 145 - qrCodeWH - 12)
        myCanvas.lineTo(whiteBlackWidth + 25, canvasHeight - 145 - qrCodeWH - 12)
        myCanvas.strokeStyle = '#e4e7ed'
        myCanvas.stroke()
        myCanvas.draw(true, () => {
          const timer = setTimeout(() => {
            uni.canvasToTempFilePath({
              canvasId: 'mycanvas',
              success (res) {
                that.saveImage(res.tempFilePath)
              },
              fail () {
                that.$Toast('warning', '海报生成失败，请重试…')
              }
            }, this)
            clearTimeout(timer)
          }, 1000)
        })
      })
    },
    saveImage (filePath) {
      const that = this
      uni.saveImageToPhotosAlbum({
        filePath,
        success () {
          that.$Toast('success', '保存成功')
        },
        fail ({errMsg}) {
          uni.hideLoading()
          if (errMsg.includes('fail auth deny')) {
            that.$Confirm(
              '提示',
              '保存相册失败，请打开设置开启保存相册权限',
              '打开设置',
              () => {
                uni.openSetting()
              }
            )
          } else {
            that.$Toast('warning', '已取消')
          }
        }
      })
    },
    // myCanvas getContext("2d") 对象
    // lineHeight 段落文本行高
    // byteLength 设置单字节文字一行内的数量
    // text 写入画面的段落文本
    // startLeft 开始绘制文本的 x 坐标位置（相对于画布）
    writeTextOnCanvas (myCanvas, lineHeight, byteLength, text, startLeft, startTop) {
      const cutString = (str, leng) => { // 按字节长度截取字符串，返回substr截取位置
        var len = str.length
        var tlen = len
        var nlen = 0
        for (var x = 0; x < len; x++) {
          if (str.charCodeAt(x) > 128) {
            if (nlen + 2 < leng) {
              nlen += 2
            } else {
              tlen = x
              break
            }
          } else {
            if (nlen + 1 < leng) {
              nlen += 1
            } else {
              tlen = x
              break
            }
          }
        }
        return tlen
      }
      for (var i = 1; getStrTrueLength(text) > 0; i++) {
        var tl = cutString(text, byteLength)
        myCanvas.fillText(text.substr(0, tl).replace(/^\s+|\s+$/, ''), startLeft, (i - 1) * lineHeight + startTop)
        text = text.substr(tl)
      }
    },
    containImg (sx, sy, boxW, boxH, sourceW, sourceH) {
      var dx = sx
      var dy = sy
      var dWidth = boxW
      var dHeight = boxH
      if (sourceW > sourceH || (sourceW === sourceH && boxW < boxH)) {
        dHeight = sourceH * dWidth / sourceW
        dy = sy + (boxH - dHeight) / 2
      } else if (sourceW < sourceH || (sourceW === sourceH && boxW > boxH)) {
        dWidth = sourceW * dHeight / sourceH
        dx = sx + (boxW - dWidth) / 2
      }
      return {
        dx,
        dy,
        dWidth,
        dHeight
      }
    },
    hasHttp (url) {
      if (url.includes('http')) {
        return url
      } else {
        return this.config.fileUrl + url
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.share{
  overflow: hidden;
  .centerShow {
    position: fixed;
    left: 70rpx;
    right: 70rpx;
    background: #fff;
    z-index: 12;
    padding: 0 0 50rpx;
    border-radius: 24rpx;
    top: 50%;
    transform: translateY(-58%);
    @extend .xy-center;
    opacity: 0;
    transition: all ease .45s;
    visibility: hidden;
    width: 520rpx;
    margin: 0 auto;
    &.show {
      opacity: 1;
      visibility: visible;
    }
    .iconfont {
      right: 0;
      color: #fff;
      top: -75rpx;
      position: absolute;
      font-size: 54rpx;
      opacity: .8;
      &:active {
        opacity: .6;
      }
    }
    .avatar {
      margin-top: -75rpx;
      /deep/ .m-image {
        border: 2px solid #fff;
        width: 150rpx;
        height: 150rpx;
        border-radius: 50%;
      }
    }
    .qrCode {
      margin-top: 50rpx;
      width: 322rpx;
      height: 322rpx;
    }
    span {
      color: #999;
      font-size: 24rpx;
      margin-top: 40rpx;
    }
    p {
      position: absolute;
      bottom: -78rpx;
      @extend .y-center;
      justify-content: center;
      .square {
        opacity: .7;
        transform: rotate(45deg);
        display: block;
        width: 14rpx;
        height: 14rpx;
        border: 1px solid #FFFFFF;
      }
      span{
        margin: 0 16rpx;
        font-size: 26rpx;
        color: #fff;
        margin: 0 16rpx;
      }
    }
  }
  .btns {
    z-index: 12;
    position: fixed;
    bottom: 0;
    width: 100%;
    border-radius:30rpx 30rpx 0 0;
    background: #EAEEF2;
    transform: translateY(100%);
    transition: all ease .3s;
    padding: 40rpx 60rpx calc(env(safe-area-inset-bottom) / 2 + 30rpx);
    @extend .y-center;
    button{
      background: transparent;
      display: flex;
      flex-direction: column;
      text-align: center;
      flex: 1;
      &::after{
        display: none;
      }
      img{
        width: 120rpx;
        height: 120rpx;
        margin-bottom: 36rpx;
      }
      span{
        font-size: 24rpx;
        color: #666;
      }
      &:active{
        opacity: .8;
      }
    }
    &.show{
      opacity: 1;
      transform: translateY(0);
    }
  }
  canvas {
    left: -9999px;
    bottom: -9999px;
    position: fixed;
    width: 580px;
    height: 830px;
  }
}
</style>