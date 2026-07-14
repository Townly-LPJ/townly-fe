import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import PostList from "../views/PostList.vue";
import PostWriteView from "../views/PostWriteView.vue";
import PostDetailView from "../views/PostDetailView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/posts/write",
    name: "PostWrite",
    component: PostWriteView,
  },
  {
    path: "/posts/detail/:id",
    name: "PostDetail",
    component: PostDetailView,
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