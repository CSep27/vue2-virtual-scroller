import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VirtualScroll from "./components/VirtualScroll.vue";

Vue.config.productionTip = false;

Vue.component("VirtualScroll", VirtualScroll);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
