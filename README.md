# vue2-virtual-scroller

虚拟列表，只加载可视区域内的内容

## 监听滚动事件做法

### 前端构建全量数据

- VirtualScroll-vX.vue 思路过程版本
- VirtualScroll.vue 最终版本

### 动态获取数据

- 在 VirtualScroll.vue 版本上修改
- VirtualScrollDynamic.vue 调接口获取数据
- 通过 mock-server 项目构造假数据

待完成：通过网络获取数据，网速慢时需要增加 loading 效果

## 使用 IntersectionObserver 优化

- VirtualScrollObserver.vue
- 使用 IntersectionObserver 改造，和监听滚动事件的逻辑不一样，需要重新写
- 还未完成，好像是不一定行

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
