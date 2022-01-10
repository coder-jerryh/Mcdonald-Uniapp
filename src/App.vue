<script>
import './assets/style/iconfont.css'
export default {
  data () {
    return {
      globalData: {
        userInfo: null,
        navHeight: 0
      }
    }
  },
  created () {
    this.$bounding = uni.getMenuButtonBoundingClientRect()
    if (uni.getStorageSync('token')) {
      // 获取用户信息
      this.getUserInfo()
    }
    // 获取用户勾选状态
    this.getRequestMsgStatus()
  },
  onShow () {
    const updateManager = uni.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        this.$Confirm(
          '更新提示',
          '同城圈新版本已经准备好啦！',
          '更新',
          () => {
            updateManager.onUpdateReady(() => {
              updateManager.applyUpdate()
            })
            updateManager.onUpdateFailed(() => {
              uni.showModal({
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
              })
            })
          }
        )
      }
    })
  }
}
</script>
<style lang='scss'>
@import './assets/style/iconfont.css';
@font-face {
  font-family: 'DIN Alternate';  /* project id 1133253 */
  src: url('./assets/font/DIN Alternate.ttf');
}
</style>