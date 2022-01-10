<template>
  <div class="m-date-picker">
     <!-- v-if="showInput" -->
    <input class="m-date-picker-input" :placeholder="`请选择${title}`" @click="openPicker" v-model="value" disabled>
    <section class="m-date-picker-popup" :class="{show}" @click="cancel" @touchmove.stop.prevent>
      <div class="content" @click.stop="$preventClick">
        <!-- 标题 -->
        <div class="title">
          <span class="cancel" @click="cancel">取消</span>
          <h1>选择{{title}}</h1>
          <span class="confirm" @click="confirmSelect">确定</span>
        </div>
        <!-- 列 -->
        <picker-view indicator-style="height: 44px;" :value="currentIndexs" @change="pickerChange">
          <!-- 年 -->
          <picker-view-column :class="{show: format.includes('y')}">
            <span v-for="(year, i) in YearOption" :key="i">{{year}}<i>年</i></span>
          </picker-view-column>
          <!-- 月 -->
          <picker-view-column :class="{show: format.includes('M')}">
            <span v-for="(month, i) in MonthOption" :key="i">{{month}}<i>月</i></span>
          </picker-view-column>
          <!-- 日 -->
          <picker-view-column :class="{show: format.includes('d')}">
            <span v-for="(day, i) in DayOption" :key="i">{{day}}<i>日</i></span>
          </picker-view-column>
          <!-- 时 -->
          <picker-view-column :class="{show: format.includes('h')}">
            <span v-for="(hour, i) in HourOption" :key="i">{{hour}}<i>时</i></span>
          </picker-view-column>
          <!-- 分 -->
          <picker-view-column :class="{show: format.includes('m')}">
            <span v-for="(minute, i) in MinuteSecondOption" :key="i">{{minute}}<i>分</i></span>
          </picker-view-column>
          <!-- 秒 -->
          <picker-view-column :class="{show: format.includes('s')}">
            <span v-for="(second, i) in MinuteSecondOption" :key="i">{{second}}<i>秒</i></span>
          </picker-view-column>
        </picker-view>
      </div>
    </section>
  </div>
</template>

<script>
import { dateFilter } from '../../utils/filters'
import {getYearOption, getMonthOption, getDayOption, getHourOption, getMSOption} from './computed'

const YearOption = getYearOption()
const MonthOption = getMonthOption()
const DayOption = getDayOption()
const HourOption = getHourOption()
const MinuteSecondOption = getMSOption()
export default{
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 格式
    format: {
      type: String,
      default: 'yyyy-MM-dd hh:mm:ss'
    },
    // 绑定值
    value: {
      type: [String, Number],
      default: ''
    },
    // 时间戳
    timestamp: {
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
    // showInput: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data () {
    return {
      // 选择的下标
      currentIndexs: [],
      // 年
      YearOption,
      // 月
      MonthOption,
      // 日
      DayOption,
      // 时
      HourOption,
      // 分秒
      MinuteSecondOption,
      // 显隐
      show: false
    }
  },
  watch: {
    show () {
      // 打开弹窗，数据回显
      this.show && this.pickerBackShow()
    },
    value () {
      if (this.value) {
        // 计算出时间戳
        this.$emit('update:timestamp', new Date(this.replaceDate(this.value)).getTime())
      }
    }
  },
  methods: {
    openPicker () {
      if (this.disabled) return
      this.show = true
    },
    // 列数滑动时
    pickerChange (e) {
      // 之前的年月
      const oldYear = YearOption[this.currentIndexs[0]]
      const oldMonth = MonthOption[this.currentIndexs[1]]
      this.currentIndexs = [...e.detail.value]
      // 新的年月
      const newYear = YearOption[this.currentIndexs[0]]
      const newMonth = MonthOption[this.currentIndexs[1]]
      // 改变年月，重新计算日
      if (newYear !== oldYear || newMonth !== oldMonth) {
        this.DayOption = getDayOption(newYear, newMonth)
      }
    },
    // 确认选择
    confirmSelect () {
      const indexs = this.currentIndexs
      const year = YearOption[indexs[0]] || 0
      const month = MonthOption[indexs[1]] || 0
      const day = DayOption[indexs[2]] || 0
      const hour = HourOption[indexs[3]] || 0
      const minute = MinuteSecondOption[indexs[4]] || 0
      const second = MinuteSecondOption[indexs[5]] || 0
      const value = dateFilter(
        new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second)),
        this.format
      )
      this.$emit('input', value)
      this.show = false
    },
    // 数据回显
    pickerBackShow () {
      let value = this.value || dateFilter('now')
      value = this.replaceDate(value)
      // 不包含时分秒，需要补充00:00:00
      value = !value.includes(' ') ? `${value} 00:00:00` : value
      this.currentIndexs = [
        // 年
        YearOption.indexOf(dateFilter(value, 'yyyy')),
        // 月
        MonthOption.indexOf(dateFilter(value, 'MM')),
        // 日
        DayOption.indexOf(dateFilter(value, 'dd')),
        // 时
        HourOption.indexOf(dateFilter(value, 'hh')),
        // 分
        MinuteSecondOption.indexOf(dateFilter(value, 'mm')),
        // 秒
        MinuteSecondOption.indexOf(dateFilter(value, 'ss'))
      ]
    },
    replaceDate (value) {
      return value.replace(/年|月|-/g, '/').replace('日', '')
    },
    // 关闭弹窗
    cancel () {
      this.show = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .m-date-picker {
    flex: 1;
    .m-date-picker-input {
      flex: 1;
      width: 100%;
    }
    .m-date-picker-popup{
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      visibility: hidden;
      transition: all ease .3s;
      z-index: 20;
      .content{
        background: #fff;
        border-radius: 30rpx 30rpx 0 0;
        position: fixed;
        width: 100%;
        bottom: 0;
        left: 0;
        transition: all ease .3s;
        transform: translateY(100%);
        .title{
          text-align: center;
          height: 100rpx;
          line-height: 100rpx;
          position: relative;
          h1{
            font-weight: bold;
            font-size: 34rpx;
            color: #1b1d20;
          }
          .cancel, .confirm{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 32rpx;
            padding: 0 30rpx;
            &.cancel {
              left: 0;
              color: #666;
            }
            &.confirm {
              right: 0;
              color: $color;
            }
            &:active {
              opacity: .7;
            }
          }
        }
        picker-view{
          text-align: center;
          height: 500rpx;
          picker-view-column {
            display: none;
            &.show {
              display: block;
            }
          }
          // 文字
          span{
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32rpx;
            i {
              font-size: 24rpx;
              margin-left: 6rpx;
            }
          }
        }
      }
      // 显示
      &.show {
        opacity: 1;
        visibility: visible;
        .content {
          transform: translateY(0);
        }
      }
    }
  }
</style>
