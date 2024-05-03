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
    <ul
      ref="list"
      class="vs-list"
      :style="{ transform: `translate(0px, ${startOffset}px)` }"
    >
      <li class="vs-item" v-for="(item, key) in visibleData" :key="key">
        item {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      screenHeight: 500,
      itemSize: 50,
      listData: [],
      visibleData: [],
      scrollTop: 0,
      startIndex: 0,
      endIndex: 0,
      startOffset: 0,
      listHeight: 0,
    };
  },
  created() {
    this.initList();
  },
  methods: {
    initList() {
      // 总数据
      for (let index = 0; index < 200; index++) {
        this.listData.push(index);
      }
      // 列表总高度
      this.listHeight = this.listData.length * this.itemSize;
      // 可显示的列表项数
      this.visibleCount = Math.ceil(this.screenHeight / this.itemSize);
      this.initVisableData();
    },
    initVisableData() {
      // 起始索引
      this.startIndex = Math.floor(this.scrollTop / this.itemSize);
      console.log("startIndex", this.startIndex);
      // 结束索引
      // endIndex需要+1，否则会出现空白
      this.endIndex = this.startIndex + this.visibleCount + 1;
      console.log("endIndex", this.endIndex);
      // 列表实际显示数据
      this.visibleData = this.listData.slice(this.startIndex, this.endIndex);
      console.log(this.visibleData);
    },
    onContainerScroll(event) {
      this.scrollTop = event.target.scrollTop;
      console.log("scrollTop", event.target.scrollTop);
      this.initVisableData();
      // 偏移量
      this.startOffset = this.scrollTop - (this.scrollTop % this.itemSize);
      console.log("startOffset", this.startOffset);
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
