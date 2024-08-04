<template>
  <!-- 可视区域容器 -->
  <div
    ref="container"
    class="vs-container"
    :style="{ height: `${screenHeight}px` }"
  >
    <!-- 总列表高度 -->
    <!-- <div
      ref="phantom"
      class="vs-phantom"
      :style="{ height: `${listHeight}px` }"
    ></div> -->
    <!-- 实际渲染区域 -->
    <ul ref="list" class="vs-list">
      <li
        ref="items"
        class="vs-item"
        v-for="item in listData"
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
    listData: {
      type: Array,
      default: () => [],
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
  },
  data() {
    return {
      scrollTop: 0,
      // 可视区的第一项索引
      startIndex: 0,
      startOffset: 0,
      isPositionsUpdated: false,
    };
  },
  /* computed: {
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
    visibleData() {
      const start = this.startIndex - this.aboveCount;
      const end = this.endIndex + this.belowCount;
      // console.log("start, end", start, end);
      return this.listData.slice(start, end);
    },
  }, */
  created() {
    // 不需要变成响应式数据
    // 列表渲染后存储每一项的高度以及位置
    this.positions = [];
    this.initPositions();
    this.nodes = [];
    // this.newNodes = []
  },
  mounted() {
    const containerTop = this.$refs.container.getBoundingClientRect();
    console.log("containerTop", containerTop);
    this.io = new IntersectionObserver(
      (entries) => {
        entries.forEach((i) => {});
      },
      {
        // root属性指定目标元素所在的容器节点（即根元素）。
        root: this.$refs.container,
      }
    );
    // 初始挂载完成后加监听
    this.nodes = this.$refs.items;
    this.nodes[0].style.height = "1000px";
    this.nodes.forEach((node) => {
      this.io.observe(node);
    });
  },
  updated() {
    this.updatePositions();
  },
  methods: {
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
      // this.startIndex = this.getStartIndex(this.scrollTop);
      // console.log("startIndex", this.startIndex);
      // this.startOffset = this.getStartOffset();
      console.log("startOffset", this.startOffset);
    },
    initPositions() {
      this.positions = this.listData.map((item, index) => {
        return {
          index,
          height: this.estimatedItemSize,
          top: index * this.estimatedItemSize,
          bottom: (index + 1) * this.estimatedItemSize,
        };
      });
    },
    // 二分查找 起始索引
    // list[i].bottom是递增的状态
    // 查找list[i].bottom > value的第一个元素
    binarySearch(list, value) {
      // 拿到中间值
      let start = 0;
      let end = list.length - 1;
      let index = end; // 超出范围时，取最后一个值
      let i = 0;
      while (end - start > 1) {
        i = Math.floor((start + end) / 2);
        const midValue = list[i].bottom;
        if (midValue === value) {
          index = i + 1;
          break;
        } else if (midValue > value) {
          end = i;
        } else if (midValue < value) {
          start = i;
        }
      }
      if (list[start].bottom > value) {
        index = start;
      } else if (list[end].bottom > value) {
        // 这里是修改后的end
        index = end;
      }
      return index;
    },
    updatePositions() {
      // 先把原来的取消观察
      /* this.nodes.forEach((node) => {
        this.io.unobserve(node);
      }); */
      const nodes = this.$refs.items;
      /* nodes.forEach((node) => {
        this.io.observe(node);
      }); */
      /* if (this.isPositionsUpdated) {
        return;
      } */
      console.log("updated————————");
      // 渲染完成后，获取列表每项的位置信息
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
      nodes.forEach((node) => {
        this.io.observe(node);
      });
      // 再等于当前的nodes
      // this.nodes = nodes;
      // 增加index判断，已经全部更新完成
      /* if (index === this.positions.length - 1) {
        this.isPositionsUpdated = true;
      } */
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
  /* &:nth-child(2n) {
    background-color: #fce3e3;
  }
  &:nth-child(2n + 1) {
    background-color: #f5ebff;
  } */
  &:last-child {
    border-bottom: none;
  }
}
</style>
