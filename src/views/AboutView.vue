<template>
  <div class="about">
    <VirtualScroll :listData="listData"></VirtualScroll>
  </div>
</template>
<script>
export default {
  data() {
    return {
      listData: [],
    };
  },
  created() {
    this.initList();
  },
  methods: {
    initList() {
      // 总数据
      for (let index = 0; index < 200; index++) {
        const r = Math.ceil((Math.random() + 0.1) * 100);
        let s = `${index}a`;
        for (let j = 0; j < r; j++) {
          s += "b";
        }
        this.listData.push(s);
      }
    },
  },
};
</script>
