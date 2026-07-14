<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const menus = [
  {
    name: "맛집",
    code: "RESTAURANT",
  },
  {
    name: "명소 · 관광",
    code: "ATTRACTION",
  },
  {
    name: "축제 · 행사",
    code: "FESTIVAL",
  },
  {
    name: "카페 · 디저트",
    code: "CAFE_DESSERT",
  },
  {
    name: "여행 팁",
    code: "TRAVEL_TIP",
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

      <button
        type="button"
        class="brand"
        aria-label="townly 홈"
        @click="goHome"
      >
        <span class="brand__logo">
          ◎
        </span>

        <strong class="brand__name">
          townly
        </strong>

        <span class="brand__region">
          대전
        </span>

      </button>



      <nav
        class="site-nav"
        aria-label="주요 메뉴"
      >

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



      <button
        type="button"
        class="header-map-button"
      >
        <span>⌖</span>
        지도
      </button>


    </div>

  </header>
</template>