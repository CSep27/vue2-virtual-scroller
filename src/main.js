import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VirtualScroll from "./components/VirtualScroll.vue";
import VirtualScrollDynamic from "./components/VirtualScrollDynamic.vue";

Vue.config.productionTip = false;

Vue.component("VirtualScroll", VirtualScroll);
Vue.component("VirtualScrollDynamic", VirtualScrollDynamic);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
