<script setup>
import { Compass, MapPin } from "lucide-vue-next";

import { useRouter } from "vue-router";

const router = useRouter();

const menus = [
  {
    name: "맛집",
    code: "restaurant",
  },
  {
    name: "명소 · 관광",
    code: "attraction",
  },
  {
    name: "축제 · 행사",
    code: "festival",
  },
  {
    name: "카페 · 디저트",
    code: "cafe_dessert",
  },
  {
    name: "여행 팁",
    code: "travel_tip",
  },
];

const goHome = () => {
  router.push("/");
};

const goCategory = (code) => {
  router.push(`/posts/${code}`);
};
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner container">
      <button type="button" class="brand" aria-label="townly 홈" @click="goHome">
        <span class="brand__logo">
          <Compass :size="21" :stroke-width="2.4" />
        </span>

        <strong class="brand__name"> townly </strong>

        <span class="brand__region"> 대전 </span>
      </button>

      <nav class="site-nav" aria-label="주요 메뉴">
        <button
          v-for="menu in menus"
          :key="menu.code"
          type="button"
          class="site-nav__link"
          @click="goCategory(menu.code)"
        >
          {{ menu.name }}
        </button>
      </nav>

      <button type="button" class="header-map-button">
        <MapPin :size="18" :stroke-width="2.3" />
        지도
      </button>
    </div>
  </header>
</template>
