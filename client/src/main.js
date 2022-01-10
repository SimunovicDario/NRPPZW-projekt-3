import { createApp } from "vue";
import store from "./store";
import { createRouter, createWebHistory } from "vue-router";
import "@babel/polyfill";
import Modal from "./components/Modal.vue";
import Home from "./pages/Home.vue";
import Main from "./layouts/Main.vue";
import NotFound from "./pages/NotFound.vue";
const routes = [
  {
    path: "",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/:abbr?",
        name: "Modal",
        component: Modal,
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
createApp(Main).use(router).use(store).mount("#app");
