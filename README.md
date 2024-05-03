# vue2-virtual-scroller

虚拟列表，只加载可视区域内的内容

startIndex 起始索引
endIndex 结束索引
可视数据渲染
startOffset 偏移位置 能够整除 itemSize 的高度，被卷上去了几个 itemSize 的高度
当滚动后，由于渲染区域相对于可视区域已经发生了偏移，此时我需要获取一个偏移量 startOffset，通过样式控制将渲染区域偏移至可视区域中。

phantom 往上滚动了，list 会跟着往上走，需要 list 始终显示在容器中，那么 list 就要往下平移。

phantom 和 list 作为 container 的子元素，当向上滚动时，会一起往上平移，那么首先序号为 0 的元素就会往上平移直到看不见，这时候可视窗口能看到的第一个元素是序号为 1 的元素。动态渲染就是看不见的元素不渲染，从需要展示在窗口的元素开始渲染。那么此时需要从序号 1 开始渲染，但是 phantom 整体的高度还是往上平移了序号 0 元素的高度，导致序号 1 元素就会显示在序号 0 元素的位置。那么在从序号 1 开始渲染的同时，需要把 phantom 往下平移序号 0 元素的高度，这样序号 1 元素才会显示在可视区域。

当滚动小于一个 itemSize 时，可以看到此时 list 还不需要平移，只有当一个项完全消失时，此时才需要往下平移一个项的高度。
所以平移高度值为：startOffset = scrollTop - (scrollTop % itemSize)
也就是能够整除 itemSize 的高度，被卷上去了几个 itemSize 的高度

假定可视区域高度固定，称之为 screenHeight
假定列表每项高度固定，称之为 itemSize
假定列表数据称之为 listData
假定当前滚动位置称之为 scrollTop

列表总高度 listHeight = listData.length \* itemSize
可显示的列表项数 visibleCount= Math.ceil(screenHeight/itemSize)
数据起始索引 startIndex =Math.floor(scrollTop/itemSize)
数据结束索引 endIndex =startIndex+visibleCount
列表显示数据 visibleData = listData.slice(startIndex,endIndex)
偏移量 startOffset = scrollTop - (scrollTop % itemSize)

———— v1 固定高度，实现动态渲染基础功能

如果滚动的特别快，还是会出现空白，所以前后再加一些数据

bufferScale 为 1，也就是说，前后各自多渲染一倍的数据，这样不会出现滚动快有空白的情况。

比如可视区显示 10 条，那么当渲染到第 11 条数据时，前面 10 条还会在，中间显示 10 条，后面还有渲染 10 条。

aboveCount 表示上面多渲染多少条，当 startIndex 大于 10 时，为 10，小于 10 时，就是 startIndex，所以是两者之间的最小值

belowCount 表示下面多渲染多少条，当 endIndex 大于 10 时，为 10，小于 10 时，取 endIndex，同样取两者之间的最小值。

那么 visibleData 就是范围就扩大为，原来的 startIndex 减去 aboveCount，原来 endIndex 加上 belowCount

startOffset，当滚动到超出 aboveCount 的高度时，才需要移动。否则上面的内容保留着。

修改写法为计算属性， 需要传入的改成 props

-----v2 在 v1 的基础上加上缓冲区，并修改写法

解决高度不确定的情况

二分查找，对于有序数组，假设是 1-200 的长度为 100 的递增数组（不是每个值都有，但是数值是从小到大），现在需要找到 30 所在的位置，那么先找到中间的值 100/2= 50，拿到 arr[50]，与 30 比较，如果比 30 大，那么接下来就找 50/2=25，拿到 arr[25]与 30 比较

动态高度计算，会有抖动发生

-----v3 不考虑缓冲区，实现动态高度功能

加缓冲区，缓冲区条数 bufferCount 是以预估高度计算的

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
