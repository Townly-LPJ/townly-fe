import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import PostList from "../views/PostList.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/posts/:category",
    name: "PostList",
    component: PostList,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
