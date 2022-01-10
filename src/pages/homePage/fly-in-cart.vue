<template>
	<ul>
		<li v-for="(item, i) in balls" :key="i" :style="item.inited ? outStyle : ''">
			<div class="inner" :style="item.inited ? innerStyle : ''">
        <!-- 飞入的餐品，无图片则是飞入小圆点 -->
        <img v-if="url" :src="url">
      </div>
		</li>
	</ul>
</template>
 
<script>
export default {
  data () {
    return {
      // 最大同时执行动画数
      maxCount: 5,
      // 飞入图片，无图片则是飞入小圆点
      url: '',
      // 集合
      // balls: new Array(5).fill({inited: false}),
      balls: [],
      // 起始位置
      startX: 0,
      startY: 0,
      // 结束位置偏移距离
      offsetX: 0,
      offsetY: 0,
      // 避免抖动
      currentRect: '',
      // 当前正在操作的
      currentId: ''
    }
  },
  computed: {
    outStyle () {
      return `
        top: ${this.startY}px;
        transform: translate3d(0, ${this.offsetY}px, 0);
        transition: transform .6s cubic-bezier(.38, -0.32, 1, .73);`
    },
    innerStyle () {
      return `
        left: ${this.startX}px;
        transform: translate3d(${this.offsetX}px, 0, 0);
        transition: transform .6s linear;
        opacity: 1`
    }
  },
  created () {
    const balls = []
    for (let i = 0; i < this.maxCount; i++) {
      balls.push({ inited: false })
    }
    this.balls = [...balls]
  },
  methods: {
    /**
     id: 作为主键，保证唯一性
     url: 餐品图片
     startRect: 起始位置坐标对象，需包含x、y
     endRect: 结束位置坐标对象，需包含x、y
     complete: 动画执行成功的回调
    **/
    addToCart (options) {
      const {id, url, startRect, endRect, complete} = options
      this.url = url
      const {x: startX, y: startY} = startRect
      const {x: endX, y: endY} = endRect

      // 避免同一餐品添加多次产生抖动
      if (this.currentId === id) {
        options.startRect = this.currentRect
      } else {
        this.currentId = id
        this.currentRect = startRect
      }
      // 保存起始坐标
      this.startX = startX
      this.startY = startY
      // 计算出偏移距离(绝对值)
      this.offsetX = -Math.abs(endX - startX)
      this.offsetY = Math.abs(endY - startY)
      for (let i = 0; i < this.balls.length; i++) {
        const item = this.balls[i]
        if (!item.inited) {
          item.inited = true
          const timer = setTimeout(() => {
            item.inited = false
            clearTimeout(timer)
            // 动画执行完成，餐品添加成功
            complete && complete()
          }, 600)
          break
        }
      }
    }
  }
}
</script>

 
<style lang='scss' scoped>
  li {
    position: fixed;
    z-index: 99;
    .inner {
      position: fixed;
      opacity: 0;
      font-size: 0;
      // 餐品图片
      img {
        width: 124rpx;
        height: 95rpx;
      }
      // 没有图片就用小圆点
      &:empty {
        border-radius: 50%;
        background: #db0007;
        width: 30rpx;
        height: 30rpx;
      }
    }
  }
</style> 