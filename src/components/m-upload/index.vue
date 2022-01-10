<template>
  <div class="mUpload" :style="{'--size': sizes[size]}">
    <button v-if="mode === 'button'" @click="chooseFile(0)">
      <i class="iconfont icon-camera"></i>
    </button>
    <ul v-else class="lists" :class="module">
      <li class="fileItem" v-for="(url, i) in fileList" :key="i">
        <!-- 视频 -->
        <m-video
          v-if="isVideo(url)"
          class="video"
          :src="url"
          size='mini'
        />
        <!-- 图片 -->
        <m-image
          v-else
          :src="url"
          @click="preview(i)"
          showLoading/>
        <i v-if="!disabled" class="iconfont icon-close" @click.stop="delFile(i)"></i>
        <i class="mainPic" v-if="showMainPic && !i">{{isVideo(url) ? '视频' : '主图'}}</i>
      </li>
      <li class="add" @click="chooseFile(0)" v-if="showUpload && !disabled">
        <!-- 长方形 -->
        <template v-if="['idCard1', 'idCard2', 'license'].includes(module)">
          <img class="btn" src="./image/carema.png">
          <img class="bg" :src="require(`./image/${module}.png`)">
        </template>
        <!-- 正方形 -->
        <template v-else>
          <i v-if="type == 'image'" class="iconfont icon-camera"></i>
          <i v-else class="iconfont icon-video"></i>
        </template>
      </li>
    </ul>
    <canvas canvas-id='imageCanvas' class='imageCanvas' :style="{width: imageWidth + 'px', height: imageHeight + 'px'}"></canvas>
  </div>
</template>

<script>
import Config from '../../config/index'
import {isVideo} from '../../utils/filters'
export default {
  props: {
    // 数据格式
    dataType: {
      type: String,
      default () {
        return 'array'
      }
    },
    // 数据源
    value: {
      type: [Array, String],
      default () {
        return []
      }
    },
    // 图片还是视频
    type: {
      type: String,
      default () {
        return 'image'
      }
    },
    // 按钮还是列表
    mode: {
      type: String,
      default () {
        return 'list'
      }
    },
    // 数量限制
    limit: {
      type: Number,
      default: 9
    },
    // 大小限制，单位kb
    maxSize: {
      type: Number,
      default: 1024
    },
    // 禁用
    disabled: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 隐藏上传框
    hiddenUpload: {
      type: Boolean,
      default () {
        return false
      }
    },
    module: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'middle'
    },
    // 主图
    showMainPic: {
      type: Boolean,
      default: false
    },
    // 多类型
    multipType: Boolean
  },
  data () {
    return {
      // 临时文件路径数组
      tempFileList: [],
      // 当前正在上传的文件在tempFileList中的下标
      currentI: 0,
      // 控制文件显示
      showFile: false,
      // 压缩图片清晰度（0到1）
      quality: 0.8,
      // 要压缩图片的宽高
      imageWidth: 0,
      imageHeight: 0,
      sizes: {
        middle: '200rpx',
        small: '185rpx',
        mini: '160rpx'
      }
    }
  },
  computed: {
    // 处理数据
    fileList () {
      if (this.value) {
        return this.isStringData ? this.value.split(',') : this.value
      } else {
        return []
      }
    },
    showUpload () {
      if (this.hiddenUpload) {
        return false
      } else if ((this.type === 'video' && !this.fileList.length) || (this.type === 'image' && this.fileList.length < this.limit)) {
        return true
      } else {
        return false
      }
    },
    // 要字符串数据
    isStringData () {
      return this.dataType === 'string'
    }
  },
  methods: {
    isVideo,
    chooseFile () {
      if (this.disabled) {
        return this.$emit('click')
      }
      // 多类型
      if (this.multipType) {
        const that = this
        const itemList = ['图片', '视频']
        uni.showActionSheet({
          itemList,
          success ({tapIndex}) {
            const item = itemList[tapIndex]
            if (item === '图片') {
              that.chooseImage()
            } else {
              that.chooseVideo()
            }
          }
        })
        return
      }
      if (this.type === 'image') {
        this.chooseImage()
      } else {
        this.chooseVideo()
      }
    },
    // 选择图片或附件
    chooseImage () {
      const that = this
      uni.chooseImage({
        count: that.limit - that.fileList.length, // 默认9
        sizeType: ['compressed', 'original'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success (res) {
          uni.showLoading({
            title: '上传中',
            mask: true
          })
          // 所有图片信息数组，包含size和path
          that.tempFileList = res.tempFiles
          // 当前图片信息
          const currentFile = that.tempFileList[that.currentI]
          // 上传之前
          that.beforeUpload(currentFile)
        }
      })
    },
    // 视频
    chooseVideo () {
      const that = this
      uni.chooseVideo({
        count: 1, // 默认1
        compressed: true, // 是否压缩所选择的视频文件
        maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success (res) {
          uni.showLoading({
            title: '上传中',
            mask: true
          })
          that.uploadIng(res.tempFilePath)
        }
      })
    },
    // 上传之前（判断是否需要压缩图片）
    beforeUpload (currentFile) {
      const that = this
      // 大于指定大小才压缩
      if (currentFile.size >= this.maxSize * 1024) {
        // 获取完整图片信息
        uni.getImageInfo({
          src: currentFile.path,
          success ({width, height, type}) {
            // gif不压缩
            if (type !== 'gif') {
              // 图片原始长宽
              let canvasWidth = width
              let canvasHeight = height
              // 压缩比例
              let ratio = 2
              // 保证宽高在500以内
              while (canvasWidth > 500 || canvasHeight > 500) {
                canvasWidth = Math.trunc(width / ratio)
                canvasHeight = Math.trunc(height / ratio)
                ratio++
              }
              // 图片宽高
              that.imageWidth = canvasWidth
              that.imageHeight = canvasHeight
              // // 最大尺寸限制
              // let maxWidth = 1200
              // let maxHeight = 600
              // //等比例压缩，如果宽度大于高度，则宽度优先，否则高度优先
              // if (width > maxWidth || height > maxHeight) {
              //   if (width / height > maxWidth / maxHeight) {
              //     // 要求宽度*(原生图片比例)=新图片尺寸
              //     canvasWidth = maxWidth
              //     canvasHeight = Math.round(maxWidth * (height / width))
              //   } else {
              //     canvasHeight = maxHeight
              //     canvasWidth = Math.round(maxHeight * (width / height))
              //   }
              // }
              // 开始压缩
              that.compressImage(currentFile.path, (res) => {
                that.uploadIng(res.tempFilePath)
              })
            } else {
              that.uploadIng(currentFile.path)
            }
          }
        })
      } else {
        // 直接上传
        this.uploadIng(currentFile.path)
      }
    },
    // 压缩图片
    compressImage (tempFile, callback) {
      const that = this
      const ctx = uni.createCanvasContext('imageCanvas', this)
      ctx.clearRect(0, 0, that.imageWidth, that.imageHeight)
      ctx.drawImage(tempFile, 0, 0, that.imageWidth, that.imageHeight)
      ctx.draw(false, () => {
        const timer = setTimeout(() => {
          clearTimeout(timer)
          uni.canvasToTempFilePath({
            canvasId: 'imageCanvas',
            fileType: 'jpg',
            quality: that.quality,
            success (res) {
              callback(res)
            },
            fail () {
              that.$Toast('warning', '图片上传失败，请重新上传！')
            }
          }, this)
        }, 500)
      })
    },
    // 上传中…
    uploadIng (tempFilePath) {
      const that = this
      uni.uploadFile({
        url: Config.uploadUrl, // 仅为示例，非真实的接口地址
        filePath: tempFilePath,
        name: 'file',
        success ({data}) {
          that.success(JSON.parse(data).data.Path)
        },
        complete () {
          that.showFile = false
          // 若为为多图则自动继续上传
          if (that.currentI < that.tempFileList.length - 1) {
            that.currentI++
            that.beforeUpload(that.tempFileList[that.currentI])
          } else {
            // 上传完毕
            that.tempFileList = []
            that.currentI = 0
            uni.hideLoading()
          }
        }
      })
    },
    // 预览图片
    preview (current) {
      uni.previewImage({
        urls: this.fileList.map(url => this.config.fileUrl + url),
        current
      })
    },
    success (url) {
      const files = [...this.fileList]
      files.push(url)
      // 多类型
      if (this.multipType) {
        const videoIndex = files.findIndex(url => this.isVideo(url))
        if (videoIndex > 0) {
          const videoUrl = files.splice(videoIndex, 1)
          files.unshift(videoUrl[0])
        }
      }
      this.$emit('input', this.handelData(files))
      this.$emit('uploadSuccess')
    },
    delFile (delI) {
      const files = this.fileList.filter((item, i) => i !== delI)
      this.$emit('input', this.handelData(files))
    },
    // 判断是不是要得字符串数据
    handelData (files) {
      return this.isStringData ? files.join(',') : files
    }
  }
}
</script>

<style lang='scss' scoped>
$size: var(--size);
button{
  background: transparent;
  width: fit-content;
  height: fit-content;
  .icon-camera {
    font-size: 56upx;
    margin-right: 20upx;
    color: #999;
    &:active {
      opacity: 0.7;
    }
  }
  &::after{
    display: none!important;
  }
}
.imageCanvas{
  position: fixed;
  left: -99999px;
  bottom: -99999px;
}
.lists{
  padding-bottom: 6rpx;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -24rpx;
  li{
    width: $size;
    height: $size;
    border-radius: 10rpx;
    background-color: #F8F7FC;
    background-size: 35%;
    background-repeat: no-repeat;
    background-position: center;
    color: #bebebe;
    text-align: center;
    position: relative;
    box-sizing: content-box;
    border: 1px solid #F8F7FC;
    margin-bottom: 20rpx;
    margin-right: 30rpx;
    transition: all ease .2s;
    &:nth-child(3n){
      margin-right: 0;
    }
    /deep/ .m-image, /deep/ video{
      position: relative;
      z-index: 1;
      border-radius: 6rpx;
      width: $size;
      height: $size;
      background: #f8f8f8;
    }
    .icon-close{
      display: inline-block;
      color: #fff;
      font-weight: bold;
      background: $orange;
      font-size: 26rpx;
      position: absolute;
      width: 40rpx;
      height: 40rpx;
      text-align: center;
      line-height: 40rpx;
      right: -15rpx;
      top: -15rpx;
      z-index: 1;
      border-radius: 50%;
      border: 1px solid #fff;
      &:active{
        opacity: .7;
      }
    }
    .mainPic {
      z-index: 1;
      position: absolute;
      bottom: 0;
      width: 100%;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      padding: 6rpx;
      font-size: 24rpx;
      border-radius: 0 0 10rpx 10rpx;
    }
    &.add{
      background-image: none;
      margin-right: 0;
      .iconfont{
        line-height: $size;
        font-size: 62rpx;
      }
    }
    // &:not(:nth-child(3n)){
    //   margin-right: 18rpx;
    // }
    // margin-bottom: 18rpx;
    &:active{
      background: #eee;
    }
  }
  &.idCard1, &.idCard2, &.license{
    li{
      border-radius: 26rpx;
      margin-right: 0;
      width: 100%;
      height:400rpx;
      line-height:400rpx;
      @extend .xy-center;
      position: relative;
      /deep/ .m-image{
        width: calc(100vw - 120rpx);
        height:400rpx;
        border-radius: 26rpx;
      }
      .btn {
        width: 138rpx;
        height: 138rpx;
        position: relative;
        z-index: 1;
      }
      .bg {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        width: calc(100vw - 120rpx);
        height:400rpx;
      }
      .icon-camera{
        font-size: 120rpx;
        &::before{
          content: "\e767";
        }
      }
    }
  }
}
</style>
