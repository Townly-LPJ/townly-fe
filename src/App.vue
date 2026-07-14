<script setup>
import SiteHeader from "./components/SiteHeader.vue";
import CategoryBoard from "./components/CategoryBoard.vue";
import ChatFloatingButton from "./components/ChatFloatingButton.vue";
import CtaSection from "./components/CtaSection.vue";
import SiteFooter from "./components/SiteFooter.vue";

const scrollToCategories = () => {
  document.querySelector("#category-board")?.scrollIntoView({
    behavior: "smooth",
  });
};
</script>

<template>
  <div class="app-shell">
    <SiteHeader />

    <main>
      <section class="hero">
        <div class="hero__shade"></div>

        <div class="hero__content container">
          <span class="hero__badge">
            ⌾ 대전 권역 로컬 커뮤니티
          </span>

          <h1 class="hero__title">
            대전의 진짜 정보,<br />
            여기 townly에 다 있어요
          </h1>

          <p class="hero__description">
            공공데이터에 흩어진 맛집 · 명소 · 축제 정보를 한 곳에서.
          </p>

          <div class="hero__actions">
            <button
              class="button button--primary"
              @click="scrollToCategories"
            >
              게시판 둘러보기
            </button>

            <button class="button button--secondary">
              지도로 보기
            </button>
          </div>
        </div>
      </section>

      <CategoryBoard />

      <CtaSection />
    </main>


    <SiteFooter />

    <ChatFloatingButton />
  </div>
</template>
