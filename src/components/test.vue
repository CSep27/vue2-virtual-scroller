<template>
  <div class="main">
    <div v-for="(row, index0) in uiPeriodList" :key="index0">
      <div class="period" :style="periodStyle">
        <div v-for="(column, index1) in row.columnList" :key="column.id">
          /* 详细展示元素 */
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.periodStyle = {
      "grid-template-columns": `52px repeat(${this.headList.length}, 1fr)`,
      height: "2000px",
    };
    let intersectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach((row) => {
        if (row.intersectionRatio <= 0) {
          if (!_this.isFirst) {
            row.target.style.height = `${row.target.clientHeight}px`;
          }

          _this.uiPeriodList[index].coordList = [];
        } else {
          row.target.style.height = "";
          _this.uiPeriodList[index].columnList =
            _this.periodList[index].columnList; // 附上实际元素
        }
      });
    }, config);
  },
  updated() {
    let rolwList = document.querySelectorAll(".period");
    let _this = this;
    let config = {
      root: document.querySelector(".main"),
    };

    let intersectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach((row) => {
        if (row.intersectionRatio <= 0) {
          if (!_this.isFirst) {
            row.target.style.height = `${row.target.clientHeight}px`;
          }

          _this.uiPeriodList[index].coordList = [];
        } else {
          row.target.className = "period";
          row.target.style.height = "";
          _this.uiPeriodList[index].columnList =
            _this.periodList[index].columnList; // 附上实际元素
        }
      });
    }, config);
    if (this.isFirst) {
      rowList.forEach((row, index) => {
        intersectionObserver.observe(row);
      });
      this.isFirst = false;
    }
  },
};
</script>

<style></style>
