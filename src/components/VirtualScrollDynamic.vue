<template>
  <!-- 可视区域容器 -->
  <div
    class="vs-container"
    @scroll="onContainerScroll"
    :style="{ height: `${screenHeight}px` }"
  >
    <!-- 总列表高度 -->
    <div
      ref="phantom"
      class="vs-phantom"
      :style="{ height: `${listHeight}px` }"
    ></div>
    <!-- 实际渲染区域 -->
    <ul ref="list" class="vs-list" :style="{ transform: listTranslate }">
      <li
        ref="items"
        class="vs-item"
        v-for="item in visibleData"
        :key="item.id"
        :id="item.id"
      >
        item {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    screenHeight: {
      type: Number,
      default: 500,
    },
    // 缓冲区比例
    bufferScale: {
      type: Number,
      default: 1,
    },
    // 选项预估高度
    estimatedItemSize: {
      type: Number,
      default: 50,
    },
    // 预估选项总条数，一共有多少条数据
    estimatedTotal: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      scrollTop: 0,
      // 可视区的第一项索引
      startIndex: 0,
      startOffset: 0,
      isPositionsUpdated: false,
      listData: [],
      visibleData: [],
    };
  },
  computed: {
    listHeight() {
      return this.positions.length > 0
        ? this.positions[this.positions.length - 1].bottom
        : 0;
    },
    visibleCount() {
      return Math.ceil(this.screenHeight / this.estimatedItemSize);
    },
    bufferCount() {
      return this.bufferScale * this.visibleCount;
    },
    endIndex() {
      return this.startIndex + this.visibleCount;
    },
    listTranslate() {
      return `translate(0px, ${this.startOffset}px)`;
    },
    aboveCount() {
      return Math.min(this.startIndex, this.bufferCount);
    },
    belowCount() {
      return Math.min(this.endIndex, this.bufferCount);
    },
    start() {
      return this.startIndex - this.aboveCount;
    },
    end() {
      return this.endIndex + this.belowCount;
    },
  },
  watch: {
    start: {
      handler(newVal) {
        this.getData(newVal, this.end);
      },
      immediate: true,
    },
  },
  created() {
    // 不需要变成响应式数据
    // 列表渲染后存储每一项的高度以及位置
    this.positions = [];
    this.initPositions();
    this.getData(this.start, this.end);
  },
  updated() {
    this.updatePositions();
  },
  methods: {
    getData(start, end) {
      const data = { start, end };
      fetch("http://localhost:3000/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((json) => {
          this.visibleData = json;
        })
        .catch((err) => console.log("Request Failed", err));
    },
    getStartIndex(scrollTop = 0) {
      // 起始索引，找到 bottom 位置大于 scrollTop 的元素，就是当前需要展示的第一个元素
      // 滚动在当前元素位置时，top会小于scrollTop，当bottom===scrollTop时，也就是当前元素滚动完毕，看不见了
      // 所以bottom>scrollTop时，当前元素展示为第一个
      // 由于this.positions是顺序排列的数组，可以用二分查找法
      // let item = this.positions.find((i) => i && i.bottom > scrollTop);
      // 这个条件下找出来的是显示在可视区域的第一个元素
      return this.binarySearch(this.positions, scrollTop);
    },
    getStartOffset() {
      // this.startIndex - this.aboveCount  也就是缓存区本来渲染的第一个元素，开始不展示了
      // 需要拿到它的top值，也就是需要平移的距离
      // 当满足this.startIndex > this.aboveCount时，也就是this.aboveCount取值为this.bufferCount时
      if (this.startIndex > this.bufferCount) {
        const renderStartIndex = this.startIndex - this.bufferCount;
        console.log("renderStartIndex", renderStartIndex);
        return this.positions[renderStartIndex].top;
      } else {
        return 0;
      }
    },
    onContainerScroll(event) {
      this.scrollTop = event.target.scrollTop;
      // console.log("scrollTop", event.target.scrollTop);
      this.startIndex = this.getStartIndex(this.scrollTop);
      // console.log("startIndex", this.startIndex);
      this.startOffset = this.getStartOffset();
      // console.log("startOffset", this.startOffset);
    },
    initPositions() {
      for (let i = 0; i < this.estimatedTotal; i++) {
        this.positions.push({
          i,
          height: this.estimatedItemSize,
          top: i * this.estimatedItemSize,
          bottom: (i + 1) * this.estimatedItemSize,
        });
      }
    },
    // 二分查找 起始索引
    // list[i].bottom是递增的状态
    // 查找list[i].bottom > value的第一个元素
    binarySearch(list, value) {
      const lastIndex = list.length - 1;
      let start = 0;
      let end = lastIndex;
      let index;
      let flag = false;
      while (start <= end) {
        let midIndex = (start + end) >> 1;
        const midValue = list[midIndex].bottom;
        if (midValue === value) {
          index = midIndex + 1;
          flag = true;
          break;
        } else if (midValue > value) {
          end = midIndex - 1;
        } else if (midValue < value) {
          start = midIndex + 1;
        }
      }
      !flag && (index = start);
      // 超出范围时，取最后一个值
      index > lastIndex && (index = lastIndex);
      return index;
    },
    updatePositions() {
      if (this.isPositionsUpdated) {
        return;
      }
      console.log("updated————————");
      // 渲染完成后，获取列表每项的位置信息
      const nodes = this.$refs.items;
      let index = 0;
      nodes.forEach((node) => {
        // Element.getBoundingClientRect() 方法返回一个 DOMRect 对象，其提供了元素的大小及其相对于视口的位置。
        const rect = node.getBoundingClientRect();
        const height = rect.height;
        // 把id字符串变成数字，当前渲染的DOM结构
        index = +node.id;
        const oldHeight = this.positions[index].height;
        const diffValue = oldHeight - height;
        if (diffValue) {
          // 更新当前元素
          this.positions[index].bottom =
            this.positions[index].bottom - diffValue;
          this.positions[index].height = height;
          // 更新后续所有元素
          for (let k = index + 1; k < this.positions.length; k++) {
            this.positions[k].top = this.positions[k - 1].bottom;
            this.positions[k].bottom = this.positions[k].bottom - diffValue;
          }
        }
      });
      // 增加index判断，已经全部更新完成
      if (index === this.positions.length - 1) {
        this.isPositionsUpdated = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.vs-container {
  width: 200px;
  border: 1px solid black;
  margin: 0 auto;
  position: relative;
  overflow-y: auto;
}
.vs-list {
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.vs-item {
  list-style: none;
  word-wrap: break-word;
  border-bottom: 1px solid black;
  padding: 4px;
  &:last-child {
    border-bottom: none;
  }
}
</style>
