# 基本思路

1. 实例化配置一个观察器，在这里除了传入回调函数外我们还会传入配置项：config = { root: document.querySelector('.main'), } 这样我们就设置了 class 为 main 的 dom 元素为容器
2. 监听列表的每一行元素
3. 在回调函数中拿到每一个行元素的 intersectionRatio，一次判断是否在可是区域内。如果进入视野则给这一行附上实际的数据进行渲染，如果移出视野则将这一行的数据置为空。此外为了定位准确，我们在元素移出视野时给一个实际渲染时的高度。
4. 我们在初始时给行元素设置一个非常大的行高，使得在视野中只存在一行，然后对这一行附上实际数据，去除行高样式，使行的高度由实际内容决定。这样可以使各个行依次进入视野，逐个渲染直到实际的高度的行元素撑满视野
5. 增加冗余量来解决这个问题，在行元素还没出现在视野当中时就附上实际数据进行渲染。查看发现在初始化 IntersectionObserver 可以传入配置项 rootMargin, rootMargin 定义根元素的 margin，用来扩展或缩小 rootBounds 这个矩形的大小，从而影响 intersectionRect 交叉区域的大小。这样就变相地达成在视野单位外就进行数据实际渲染的目的

先渲染一个 div 占位，等到触发 callback 了再替换成实际的内容。监听的是占位 DOM，渲染占位 DOM 和渲染实际内容相比开销小到忽略不计。

# 其他

1. IntersectionObserver 文章里说可以用，但是还不清楚怎么用

IntersectionObserver 可以监听目标元素是否出现在可视区域内，在监听的回调事件中执行可视区域数据的更新，并且 IntersectionObserver 的监听回调是异步触发，不随着目标元素的滚动而触发，性能消耗极低。

滚动时做了两件事，startIndex 和 startOffset 的更新，所以就是搞清楚这个关系

list 滚动到第一个渲染出来的元素的 top 值

监听渲染出来的每个 DOM 元素？当 intersectionRatio 为 0 时，下一个就是 startIndex 了，startOffset 还是一样的算法

问题：增加了监听，当 DOM 重新被渲染，监听又恢复了，又触发一次函数

并不是在现有的基础上改用 IntersectionObserver，

而是用新的方案
https://mp.weixin.qq.com/s/cf9EOPKyXVhtxbm9fsPpLA

2. 使用 ResizeObserver 来监听列表项内容区域的高度改变，从而实时获取每一列表项的高度。如何实现

# 其他

当列表项内容中包含图片时，高度由图片高度撑开的话，如果在 updated 里获取真实高度时，图片还没有加载完成，这时候就没有获取到真实的图片高度。

[ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver) 可以用来监听列表项内容区域高度的变化，从而获取每一项真实的高度。兼容性有问题。

如果它的实现遵循规范，则应在绘制前和布局后调用 resize 事件。paint 前，layout 后。（见《浏览器渲染过程》）

用法见 code/resize-observer.html。页面初始化时，创建了 resizeObserver 对象，观察 container 的变化。当滑动 slider 时，container 的宽度会变成 slider 的值，那么就会触发 new ResizeObserver 时的回调。在回调中可以拿到更改后的 container 的尺寸，这时候相应的改变 h1 和 p 标签的 fontSize。因此可以看到当滑动滑块时，h1 和 p 的大小也在相应变化。

所以就是观察每个列表 item 项的尺寸变化，等图片渲染完了，尺寸确定的时候，去更新 positions。试试！
