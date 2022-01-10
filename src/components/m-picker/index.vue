<template>
  <div class="m-picker">
    <input class="m-picker-input" :placeholder="placeholder || `选择${title}`" @click="openPicker" v-model="selectedLabel" disabled>
    <section class="m-picker-popup" :class="{show}" @click="cancel" @touchmove.stop.prevent>
      <div class="content" @click.stop="$preventClick">
        <!-- 标题 -->
        <div class="title">
          <span class="cancel" @click="cancel">取消</span>
          <h1>{{title}}</h1>
          <span class="confirm" :class="{disabled: isScrolling}" @click="confirmSelect">确定</span>
        </div>
        <!-- 列 -->
        <picker-view
          indicator-style="height: 44px;"
          :value="pickerIndexs"
          @change="pickerChange"
          @pickstart="pickScroll(true)"
          @pickend="pickScroll(false)">
          <!-- 第一列 -->
          <picker-view-column>
            <span v-for="(item, i) in dataOption" :key="i">{{item.label}}</span>
          </picker-view-column>
          <!-- 第二列 -->
          <picker-view-column v-if="pickerColumn > 1">
            <span v-for="(item, i) in dataOption2" :key="i">{{item.label}}</span>
          </picker-view-column>
        </picker-view>
      </div>
    </section>
  </div>
</template>

<script>
//  数组或者对象是否有数据
const hasLength = (data) => {
  let length = 0
  if (Array.isArray(data)) {
    length = data.length
  } else {
    length = Object.values(data).length
  }
  return Boolean(length)
}
export default{
  props: {
    // 类型
    type: {
      type: String,
      default: ''
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 占位
    placeholder: {
      type: String,
      default: ''
    },
    // 列数
    column: {
      type: Number,
      default: 1
    },
    // 数据
    option: {
      type: [Object, Array],
      default () {
        // label、value、children
        return []
      }
    },
    // 绑定值
    value: {
      type: [String, Number],
      default: ''
    },
    // 展示的值，接口需要label才传递
    label: {
      type: [String, Number],
      default: ''
    },
    // label分隔符，column大于1可传递
    labelSplit: {
      type: String,
      default: ''
    },
    // value分隔符，column大于1可传递，默认英文逗号分隔
    valueSplit: {
      type: String,
      default: ','
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 输入框回显的label
      selectedLabel: '',
      // 选择的下标
      pickerIndexs: [],
      // 列数
      pickerColumn: 1,
      // 数据项1
      dataOption: [],
      // 数据项2
      dataOption2: [],
      // 显隐
      show: false,
      // 滑动中
      isScrolling: false
    }
  },
  computed: {
    // 为了同时监听数据变化
    depData () {
      const { option, value } = this
      return { option, value }
    }
  },
  watch: {
    depData: {
      handler ({ option, value }) {
        // 两个数据都有才执行
        if (hasLength(option)) {
          // 格式化数据
          this.formatOption()
          // 数据回显
          this.dataBackShow()
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    // 存为自己的column
    this.pickerColumn = this.column
    // 年龄option
    if (this.type === 'age') {
      this.getAgeOption()
    }
  },
  methods: {
    openPicker () {
      if (this.disabled) return
      this.show = true
    },
    // 滑动开关
    pickScroll (flag) {
      this.isScrolling = flag
    },
    // 列数滑动时
    pickerChange (e) {
      // 之前的indexs
      const beforeIndexs = [...this.pickerIndexs]
      // 新的indexs
      this.pickerIndexs = [...e.detail.value]
      if (this.pickerColumn > 1) {
        const column1Index = this.pickerIndexs[0]
        // 第一列被改变
        if (beforeIndexs[0] !== this.pickerIndexs[0]) {
          // 改变第二列，且第二列下标归0
          this.pickerIndexs[1] = 0
          this.dataOption2 = this.dataOption[column1Index].children
        }
      }
    },
    // 确认选择
    confirmSelect () {
      if (this.isScrolling) return
      const column1Item = this.dataOption[this.pickerIndexs[0]]
      let value = column1Item.value
      if (this.pickerColumn > 1) {
        const column2Item = this.dataOption2[this.pickerIndexs[1]]
        value = `${column1Item.value}${this.valueSplit}${column2Item.value}`
      }
      this.$emit('input', value)
      this.$emit('confirm')
      this.show = false
    },
    // 数据回显（根据value匹配label、picker对应的index）
    dataBackShow () {
      if (typeof this.value === 'undefined') return
      const {dataOption, dataOption2, value, valueSplit, labelSplit, column, pickerColumn} = this
      const isMulti = column > 1 || pickerColumn > 1
      const valueArr = isMulti ? String(value).split(valueSplit) : [value]
      // 第一列匹配的下标
      const column1Index = dataOption.findIndex(item => item.value === valueArr[0])
      let pickerIndexs = [column1Index === -1 ? 0 : column1Index]
      if (isMulti) {
        // 找到value对应的lable
        const column2Index = dataOption2.findIndex(item => item.value === valueArr[1])
        const labelOption = dataOption[column1Index]
        const label1 = labelOption ? labelOption.label : ''
        const label2Option = dataOption2[column2Index]
        const label2 = label2Option ? label2Option.label : ''
        this.selectedLabel = label1 && label2 ? `${label1}${labelSplit}${label2}` : ''

        // 第二列匹配的下标
        pickerIndexs.push(column2Index === -1 ? 0 : column2Index)
      } else {
        const selectedItem = dataOption.find(item => item.value === value)
        this.selectedLabel = selectedItem ? selectedItem.label : ''
      }
      this.$emit('update:label', this.selectedLabel)
      this.$emit('changeLabel', this.selectedLabel)
      // 延迟加载，不然无法正常回显指定下标位置
      this.$nextTick(() => {
        this.pickerIndexs = [...pickerIndexs]
      })
    },
    // 格式化数据线option
    formatOption () {
      const {option} = this
      const isArr = Array.isArray(option)
      if (this.type || (isArr && !option.length)) return
      this.dataOption = []
      // 多列联动
      if (this.column > 1) {
        this.dataOption = [...option]
        this.dataOption2 = option[0].children
        this.pickerIndexs = [0, 0]
      } else {
        // 单列
        this.pickerIndexs = [0]
        // 是对象
        if (isArr) {
          // 是数组
          this.dataOption = [...option]
        } else {
          for (const key in option) {
            this.dataOption.push({
              label: option[key],
              value: isNaN(key) ? key : Number(key)
            })
          }
        }
      }
    },
    // 指定年龄option
    getAgeOption () {
      this.pickerColumn = 2
      let ageOption = []
      for (let s = 1; s <= 59; s++) {
        let obj = {
          label: s + '岁',
          value: s,
          children: []
        }
        for (let e = s + 1; e <= 60; e++) {
          obj.children.push({
            label: e + '岁',
            value: e
          })
        }
        ageOption.push(obj)
      }
      this.dataOption = [...ageOption]
      this.dataOption2 = ageOption[0].children
      this.pickerIndexs = [0, 0]
    },
    // 关闭弹窗
    cancel () {
      this.show = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .m-picker {
    flex: 1;
    .m-picker-input {
      flex: 1;
      width: 100%;
    }
    .m-picker-popup{
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
        transition: transform ease .3s;
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
              &.disabled {
                opacity: .6;
              }
            }
            &:active {
              opacity: .7;
            }
          }
        }
        picker-view{
          text-align: center;
          height: 500rpx;
          // 文字
          span{
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32rpx;
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
