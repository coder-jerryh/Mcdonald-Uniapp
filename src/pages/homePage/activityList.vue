<template>
  <div class='homePage'>
    <!-- 地图模式 -->
    <map
      v-if="isMapModel"
      :markers="markers"
      :include-points="markers"
      :latitude="markers[0] ? markers[0].latitude : ''"
      :longitude="markers[0] ? markers[0].longitude : ''"
      @markertap='markerTap'
      />
    <section>
      <nav>
        <m-search hideBtn v-model="pages.search" @confirm='firstPage' :focus='focus'/>
        <ul class="filterBar" v-if="!advOption[title]">
          <li @click="openChildMenu(0)">
            <label>{{typeStr || '全部类型'}}</label>
            <i class="iconfont icon-xia" :class="{showMenu: showMenu1}"></i>
          </li>
          <li @click="openChildMenu(1)">
            <label>{{orderStr || '排序'}}</label>
            <i class="iconfont icon-xia" :class="{showMenu: showMenu2}"></i>
          </li>
          <li @click="changeModel" v-if="activityCount" :class="{isMapModel}">
            <img src="../../assets/image/mapModel.png" alt="">
          </li>
        </ul>
        <ul class="childMenu1" :class="{showMenu: showMenu1}">
          <li v-for="(item, i) in typeOption" :key="i" @click="changeType(item)">
            <span>{{item.label}}</span>
            <i v-if="pages.type == item.value" class="iconfont icon-right"></i>
          </li>
        </ul>
        <ul class="childMenu2" :class="{showMenu: showMenu2}">
          <li v-for="(item, i) in orderOption" :key="i" @click="changeOrder(item)">
            <span>{{item.label}}</span>
            <i v-if="pages.order == item.value" class="iconfont icon-right"></i>
            <!-- <img v-if="item.sort == 0" src="../../assets/image/sort0.png" alt="">
            <img v-if="item.sort == '-1'" src="../../assets/image/sort1.png" alt="">
            <img v-if="item.sort == 1" src="../../assets/image/sort2.png" alt=""> -->
          </li>
        </ul>
      </nav>
      <m-scroll ref='mScroll' v-model="pages" @getData='getData' nativePullLoading :emptyHeight="isMapModel ? '28vh' : '50vh'">
        <ul class="activityList row">
          <activity-item
            v-for="(item, i) in list"
            :key="item.id"
            isRow
            :item='item'
            :index='`good-list3-${i}`'
            @firstPage='firstPage'/>
        </ul>
      </m-scroll>
    </section>
  </div>
</template>

<script>
import activityItem from '../components/activity-item.vue'
import mSearch from '../../components/m-search/index.vue'
import {getActivityListApi} from '../../api/activity'
import {getLocation} from '../../utils/method.js'

export default {
  components: {
    activityItem,
    mSearch
  },
  data () {
    return {
      title: '',
      markers: [],
      isMapModel: false,
      typeOption: [
        {
          label: '全部类型',
          value: 0,
          checked: false
        },
        {
          label: '浏览推广',
          value: 1,
          checked: false
        },
        {
          label: '到店打卡',
          value: 2,
          checked: false
        },
        {
          label: '自定义',
          value: 3,
          checked: false
        }
      ],
      orderOption: [
        {
          label: '默认排序',
          value: 0,
          sort: 0
        },
        {
          label: '离我最近',
          value: 1,
          sort: 0
        },
        {
          label: '薪资最高',
          value: 2,
          sort: 0
        }
      ],
      showMenu1: false,
      showMenu2: false,
      pages: {
        ...this.$pages,
        type: 0,
        order: 0,
        search: ''
      },
      activityCount: 0,
      userCity: '',
      advOption: {
        广告位: 1,
        热点精选: 2,
        活动置顶: 3,
        强力推荐: 4,
        预告展示: 5
      },
      list: [],
      focus: false
    }
  },
  onShareAppMessage () {
    return {
      title: '邀请你使用同城圈'
    }
  },
  onPullDownRefresh () {
    this.$refs.mScroll.pullRefresh()
  },
  onReachBottom () {
    this.$refs.mScroll.loadMore()
  },
  computed: {
    typeStr () {
      return this.typeOption.find(item => item.value === this.pages.type)?.label
    },
    orderStr () {
      return this.orderOption.find(item => item.value === this.pages.order)?.label
    }
  },
  onLoad (options) {
    this.title = options.title
    this.focus = options.focus === 'true'
    uni.setNavigationBarTitle({
      title: this.title
    })
    getLocation().then(({city, latitude, longitude}) => {
      this.pages.address = `${latitude},${longitude}`
      this.userCity = city
      if (this.isLogin) {
        this.getData()
      } else {
        this.$refs.mScroll.noLogin()
      }
    })
  },
  onShow () {
    if (uni.getStorageSync('fromLogin') || uni.getStorageSync('refreshActivityList')) {
      this.pages.page = 1
      this.getData()
      uni.removeStorageSync('fromLogin')
      uni.removeStorageSync('refreshActivityList')
    }
  },
  methods: {
    openChildMenu (index) {
      if (index === 0) {
        this.showMenu1 = !this.showMenu1
        this.showMenu2 = false
      } else {
        this.showMenu2 = !this.showMenu2
        this.showMenu1 = false
      }
    },
    changeType (item) {
      this.pages.type = item.value
      this.firstPage()
      this.showMenu1 = false
    },
    changeOrder (item) {
      this.pages.order = item.value
      this.firstPage()
      this.showMenu2 = false
      // const sort = this.orderOption[i].sort
      // this.orderOption.forEach(item => { item.sort = 0 })
      // this.orderOption[i].sort = sortNum[sort]
      // const typeItem = this.orderOption.find(item => item.sort !== 0)
      // this.pages.order = typeItem ? typeItem.label : ''
      // this.showMenu2 = false
      // this.firstPage()
    },
    firstPage () {
      this.pages.page = 1
      this.getData()
    },
    getData () {
      console.log(this.pages)
      if (!this.isLogin) {
        return this.$toUrl('/pages/login/index')
      }
      if (this.pages.page === 1) {
        this.list = []
      }
      let listApi = {
        附近: 'activity_list',
        浏览: 'views_activity_list',
        收藏: 'collection_activity_list'
      }[this.title]
      const advId = this.advOption[this.title]
      if (advId) {
        listApi = 'get_index_adv_list'
        this.pages.advId = advId
      }
      getActivityListApi(listApi, this.pages).then(({data}) => {
        this.list = [...this.list, ...data.list]
        data.hasNextPage = this.list.length < data.total
        if (!this.activityCount) {
          this.activityCount = data.total
        }
        this.$refs.mScroll.loadSuccess(data)
        this.getMakers()
      })
    },
    getMakers () {
      const markers = []
      this.list.forEach((item, i) => {
        markers.push({
          // 唯一标识
          id: i,
          // 标记点图片
          iconPath: '/static/location.png',
          // 标记点宽高
          width: 30,
          height: 30,
          // 经纬度
          latitude: item.address.split(', ')[0],
          longitude: item.address.split(', ')[1]
        })
      })
      this.markers = [...markers]
    },
    // 点击标记点触发
    markerTap (e) {
      const id = e.detail.markerId
      const item = this.list[id]
      this.list = [item]
    },
    changeModel () {
      this.isMapModel = !this.isMapModel
      if (!this.isMapModel) {
        this.firstPage()
      }
    },
    turnPage (item) {
      if (item.appId) {
        wx.navigateToMiniProgram({
          appId: item.appId,
          path: item.path,
          envVersion: 'release'
        })
      } else if (item.url) {
        let url = item.url
        url = item.params ? `${item.url}&params=${JSON.stringify(item.params || '{}')}` : url
        this.$toUrl(url)
      } else {
        this.$Toast('warning', '努力开发中，敬请期待…')
      }
    }
  }
}
</script>

<style lang='scss' scoped>
  .homePage{
    background: #fff;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: auto;
    map {
      width: 100vw;
      height: calc(100vh - 580rpx);
    }
    nav {
      padding: 20rpx 30rpx;
      background: #fff;
      position: sticky;
      width: 100%;
      top: 0;
      z-index: 10;
      @extend .border-b;
      .filterBar {
        padding-top: 10rpx;
        margin-bottom: -10rpx;
        @extend .y-center;
        li {
          @extend .y-center;
          height: 64rpx;
          label {
            font-size: 26rpx;
            color: #666;
          }
          .iconfont {
            color: #999;
            font-size: 24rpx;
            margin-left: 8rpx;
            font-weight: bold;
            transition: all ease .25s;
            display: block;
            &.showMenu {
              transform: rotate(180deg);
            }
          }
          &:first-child {
            margin-right: 36rpx;
          }
          &:nth-child(3) {
            margin-left: auto;
            &.isMapModel {
              background: $bgColor;
              width: 60rpx;
              height: 56rpx;
              @extend .xy-center;
              border-radius: 6rpx;
            }
            img {
              width: 40rpx;
              height: 37rpx;
            }
            &:active {
              opacity: .7;
            }
          }
        }
      }
      .childMenu1, .childMenu2 {
        left: 0;
        top: 195rpx;
        margin-left: 30rpx;
        z-index: 10;
        position: absolute;
        padding: 0 24rpx;
        box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
        background: #fff;
        border-radius: 6rpx;
        opacity: 0;
        transform: scaleY(0);
        transition: transform .3s cubic-bezier(0.23, 1, 0.32, 1), opacity .3s cubic-bezier(0.23, 1, 0.32, 1);
        &.childMenu2 {
          left: 170rpx;
        }
        &::before {
          content: '';
          width: 20rpx;
          height: 20rpx;
          display: block;
          position: absolute;
          top: -8rpx;
          left: 30rpx;
          border-radius: 4rpx;
          transform: rotate(45deg);
          background: #fff;
        }
        li {
          width: 260rpx;
          color: #666;
          font-size: 28rpx;
          padding: 24rpx 0;
          @extend .y-center;
          justify-content: space-between;
          &:first-child {
            border-radius: 6rp 6rpx 0 0;
          }
          &:last-child {
            border-radius: 0 0 6rpx 6rpx;
          }
          &:not(:last-child) {
            @extend .border-b;
          }
          img {
            width: 19rpx;
            height: 24rpx;
          }
          .icon-right {
            font-size: 32rpx;
            font-weight: bold;
            color: $orange;
          }
          &:active {
            opacity: .7;
          }
        }
        &.showMenu {
          opacity: 1;
          transform: scaleY(1);
          transform-origin: center top;
        }
      }
    }
    section {
      overflow: auto;
      flex: 1;
    }
    .activityList {
      padding: 30rpx 30rpx 0;
      &:empty {
        padding: 0;
      }
      &.row {
        /deep/ .activity-item {
          @extend .border-b;
        }
        activity-item:last-child {
          /deep/ .activity-item {
            margin-bottom: 0;
          }
        }
      }
    }
    /deep/ .m-scroll {
      &:empty {
        background: transparent;
      }
    }
  }
</style>
