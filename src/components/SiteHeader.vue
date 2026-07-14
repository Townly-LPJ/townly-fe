<script setup>
const menus = ['맛집', '명소 · 관광', '축제 · 행사', '카페 · 디저트', '여행 팁']
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner container">
      <a href="#" class="brand" aria-label="townly 홈">
        <span class="brand__logo">◎</span>
        <strong class="brand__name">townly</strong>
        <span class="brand__region">대전</span>
      </a>

      <nav class="site-nav" aria-label="주요 메뉴">
        <a
          v-for="menu in menus"
          :key="menu"
          href="#category-board"
          class="site-nav__link"
        >
          {{ menu }}
        </a>
      </nav>

      <button type="button" class="header-map-button">
        <span>⌖</span>
        지도
      </button>
    </div>
  </header>
</template>
