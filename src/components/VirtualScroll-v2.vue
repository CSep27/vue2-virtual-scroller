<template>
  <!-- 可视区域容器 -->
  <div class="vs-container" @scroll="onContainerScroll">
    <!-- 总列表高度 -->
    <div
      ref="phantom"
      class="vs-phantom"
      :style="{ height: `${listHeight}px` }"
    ></div>
    <!-- 实际渲染区域 -->
    <ul ref="list" class="vs-list" :style="{ transform: listTranslate }">
      <li class="vs-item" v-for="(item, key) in visibleData" :key="key">
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
    itemSize: {
      type: Number,
      default: 50,
    },
    listData: {
      type: Array,
      default: () => [],
    },
    //缓冲区比例
    bufferScale: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      // screenHeight: 500,
      // itemSize: 50,
      // listData: [],
      scrollTop: 0,
      // visibleData: [],
      // startIndex: 0,
      // endIndex: 0,
      // startOffset: 0,
      // listHeight: 0,
    };
  },
  computed: {
    listHeight() {
      return this.listData.length * this.itemSize;
    },
    visibleCount() {
      return Math.ceil(this.screenHeight / this.itemSize);
    },
    bufferCount() {
      return this.bufferScale * this.visibleCount;
    },
    startIndex() {
      return Math.floor(this.scrollTop / this.itemSize);
    },
    endIndex() {
      return this.startIndex + this.visibleCount;
    },
    startOffset() {
      const bufferSize = this.bufferCount * this.itemSize;
      if (this.scrollTop > bufferSize) {
        return this.scrollTop - bufferSize - (this.scrollTop % this.itemSize);
      } else {
        return 0;
      }
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
      console.log(start, end);
      return this.listData.slice(start, end);
      // return this.listData.slice(this.startIndex, this.endIndex);
    },
  },
  methods: {
    onContainerScroll(event) {
      this.scrollTop = event.target.scrollTop;
      console.log("scrollTop", event.target.scrollTop);
    },
  },
};
</script>

<style lang="scss" scoped>
.vs-container {
  height: 500px;
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
  height: 50px;
  &:nth-child(2n) {
    background-color: #fce3e3;
  }
  &:nth-child(2n + 1) {
    background-color: #f5ebff;
  }
}
</style>
