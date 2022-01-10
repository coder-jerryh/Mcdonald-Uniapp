// 如果uniapp中
import Vue from 'vue'
// 如果是小程序中（待编写）
// Toast
// icon、title为必传
const Toast = (icon, title, onShow = null, duration = 1800, mask) => {
  // loading框
  if (icon === 'loading') {
    uni.showLoading({ title })
    // 关闭Loading调用
    // uni.hideLoading()
  } else {
    const timer1 = setTimeout(() => {
      clearTimeout(timer1)
      uni.showToast({
        title, // 提示的内容,
        icon: icon === 'warning' ? 'none' : 'success', // 图标,
        duration, // 延迟时间,
        mask, // 显示透明蒙层，防止触摸穿透,
        success: res => {
          if (onShow) {
            let timer2 = setTimeout(() => {
              onShow()
              clearTimeout(timer2)
            }, duration)
          }
        }
      })
    })
  }
}

// Confirm
// title、content为必传
const Confirm = (title = '提示', content, confirmText = '确定', onConfirm, cancelText = '取消', onCancel = null) => {
  uni.showModal({
    title, // 提示的标题,
    content, // 提示的内容,
    showCancel: true, // 是否显示取消按钮,
    cancelText, // 取消按钮的文字，默认为取消，最多 4 个字符(注：多了弹窗不会显示),
    cancelColor: '#444', // 取消按钮的文字颜色,
    confirmText, // 确定按钮的文字，默认为取消，最多 4 个字符(注：多了弹窗不会显示),
    confirmColor: '#ffbc0d', // 确定按钮的文字颜色,
    success: res => {
      if (res.confirm) {
        onConfirm()
      } else if (res.cancel) {
        if (onCancel) {
          onCancel()
        }
      }
    }
  })
}

// Alert
// title、content为必传
const Alert = (title = '', content, confirmText = '确定', onConfirm) => {
  uni.showModal({
    title,
    content, // 提示的内容,
    showCancel: false, // 是否显示取消按钮,
    confirmText, // 确定按钮的文字，默认为取消，最多4个字符(注：多了弹窗不会显示),
    confirmColor: '#ffbc0d', // 确定按钮的文字颜色,
    success: res => {
      if (res.confirm && onConfirm) {
        onConfirm()
      }
    }
  })
}

// 注册到Vue原型上
Vue.prototype.$Toast = Toast
Vue.prototype.$Confirm = Confirm
Vue.prototype.$Alert = Alert
