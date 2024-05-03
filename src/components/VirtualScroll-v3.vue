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
        v-for="(item, key) in visibleData"
        :key="key"
      >
        item {{ item }}
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
    /* itemSize: {
      type: Number,
      default: 50,
    }, */
    listData: {
      type: Array,
      default: () => [],
    },
    //缓冲区比例
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
      // screenHeight: 500,
      // itemSize: 50,
      // listData: [],
      scrollTop: 0,
      // visibleData: [],
      startIndex: 0,
      // endIndex: 0,
      startOffset: 0,
      listHeight: 0,
      // 列表渲染后存储每一项的高度以及位置
      positions: [],
    };
  },
  computed: {
    /* listHeight() {
      console.log(this.positions);
      // return this.listData.length * this.itemSize;
      // 列表高度不固定，那么高度就是最后一项的底部距离列表顶部的位置
      return this.positions[this.positions.length - 1].bottom;
    }, */
    visibleCount() {
      return Math.ceil(this.screenHeight / this.estimatedItemSize);
    },
    bufferCount() {
      return this.bufferScale * this.visibleCount;
    },
    /* startIndex(scrollTop = 0) {
      // 起始索引，找到 bottom 位置大于 scrollTop 的元素
      // 由于this.positions是顺序排列的数组，可以用二分查找法
      let item = this.positions.find((i) => i && i.bottom > scrollTop);
      // let item = this.binarySearch(this.positions, scrollTop)
      return item.index;
      // return Math.floor(this.scrollTop / this.itemSize);
    }, */
    endIndex() {
      return this.startIndex + this.visibleCount;
    },
    // startOffset() {
    //   // 滚动到
    //   /* if (this.startIndex >= 1) {
    //     return this.positions[this.startIndex - 1].bottom;
    //   } else {
    //     return 0;
    //   } */
    //   // const bufferSize = this.bufferCount * this.itemSize;
    //   // const showIndex = this.startIndex + this.bufferCount;
    //   const h = this.positions[this.startIndex].top;
    //   // this.positions(())
    //   if (this.scrollTop > h) {
    //     // return this.scrollTop - bufferSize - (this.scrollTop % this.itemSize);
    //     return (
    //       this.scrollTop -
    //       this.positions[this.startIndex].top -
    //       this.positions[this.startIndex].height
    //     );
    //   } else {
    //     return 0;
    //   }
    // },
    listTranslate() {
      return `translate(0px, ${this.startOffset}px)`;
      // return `translate(0px, ${this.getStartIndex()}px)`;
    },
    aboveCount() {
      return Math.min(this.startIndex, this.bufferCount);
    },
    belowCount() {
      return Math.min(this.endIndex, this.bufferCount);
    },
    visibleData() {
      /* const start = this.startIndex - this.aboveCount;
      const end = this.endIndex + this.belowCount;
      console.log(start, end);
      return this.listData.slice(start, end); */
      return this.listData.slice(this.startIndex, this.endIndex);
    },
  },
  methods: {
    getStartIndex(scrollTop = 0) {
      // 起始索引，找到 bottom 位置大于 scrollTop 的元素，就是当前需要展示的第一个元素
      // 滚动在当前元素位置时，top会小于scrollTop，当bottom===scrollTop时，也就是当前元素滚动完毕，看不见了
      // 所以bottom>scrollTop时，当前元素展示为第一个
      // 由于this.positions是顺序排列的数组，可以用二分查找法
      // let item = this.positions.find((i) => i && i.bottom > scrollTop);
      let index = this.binarySearch(this.positions, scrollTop);
      console.log("item.index", index);
      return index;
      // return Math.floor(this.scrollTop / this.itemSize);
    },
    getStartOffset() {
      // 滚动到
      /* if (this.startIndex >= 1) {
        return this.positions[this.startIndex - 1].bottom;
      } else {
        return 0;
      } */
      // const bufferSize = this.bufferCount * this.itemSize;
      // const showIndex = this.startIndex + this.bufferCount;
      // this.positions(())
      console.log(this.positions[this.startIndex]);
      if (this.startIndex >= 1) {
        // const h = this.positions[this.startIndex].top;
        // return this.scrollTop - bufferSize - (this.scrollTop % this.itemSize);
        return this.positions[this.startIndex].top;
      } else {
        return 0;
      }
    },
    onContainerScroll(event) {
      this.scrollTop = event.target.scrollTop;
      console.log("scrollTop", event.target.scrollTop);
      this.startIndex = this.getStartIndex(this.scrollTop);
      this.startOffset = this.getStartOffset();
      console.log("startIndex", this.startIndex);
      // console.log("startOffset", this.startOffset);
    },
    initPositions() {
      // console.log(this.listData);
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
      let index = -1;
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
        index = end;
      }
      return index;
    },
  },
  mounted() {
    this.initPositions();
    this.listHeight = this.positions[this.positions.length - 1].bottom;
  },
  updated() {
    // 渲染完成后，获取列表每项的位置信息
    const nodes = this.$refs.items;
    // console.log(nodes);
    nodes.forEach((node, index) => {
      // Element.getBoundingClientRect() 方法返回一个 DOMRect 对象，其提供了元素的大小及其相对于视口的位置。
      const rect = node.getBoundingClientRect();
      const height = rect.height;
      // ?
      // const index = +node.id.slice(1);
      const oldHeight = this.positions[index].height;
      const diffValue = oldHeight - height;
      if (diffValue) {
        // 更新当前元素
        this.positions[index].bottom = this.positions[index].bottom - diffValue;
        this.positions[index].height = height;
        // 更新后续所有元素
        for (let k = index + 1; k < this.positions.length; k++) {
          this.positions[k].top = this.positions[k - 1].bottom;
          this.positions[k].bottom = this.positions[k].bottom - diffValue;
        }
      }
    });
    this.listHeight = this.positions[this.positions.length - 1].bottom;
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
}
</style>
