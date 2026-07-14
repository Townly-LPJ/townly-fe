<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goCategory = (category) => {
  router.push(`/posts/${category}`);
};

const categories = [
  {
    icon: "🍴",
    title: "맛집",
    code: "restaurant",
    description: "성심당부터 로컬 노포까지",
  },
  {
    icon: "📍",
    title: "명소 · 관광",
    code: "attraction",
    description: "엑스포 · 수목원 · 대청호",
  },
  {
    icon: "🎉",
    title: "축제 · 행사",
    code: "festival",
    description: "지금 열리는 대전의 축제",
  },
  {
    icon: "☕",
    title: "카페 · 디저트",
    code: "cafe_dessert",
    description: "감성 카페와 빵지순례",
  },
  {
    icon: "💡",
    title: "여행 팁",
    code: "travel_tip",
    description: "교통 · 주차 · 코스 꿀팁",
  },
  {
    icon: "💬",
    title: "동네 후기",
    code: "local_review",
    description: "주민이 남기는 솔직 후기",
  },
];
</script>


<template>
  <section id="category-board" class="category-section">
    <div class="container">

      <div class="section-heading">
        <h2>카테고리 게시판</h2>
        <p>관심 있는 주제를 골라보세요</p>
      </div>


      <div class="category-grid">

        <button
          v-for="category in categories"
          :key="category.title"
          type="button"
          class="category-card"
          @click="goCategory(category.code)"
        >

          <span class="category-card__icon">
            {{ category.icon }}
          </span>


          <span class="category-card__content">
            <strong>
              {{ category.title }}
            </strong>

            <small>
              {{ category.description }}
            </small>
          </span>

        </button>

      </div>

    </div>
  </section>
</template>