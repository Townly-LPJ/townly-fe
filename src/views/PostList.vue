<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Search, SquarePen } from "lucide-vue-next";
import { timeAgo } from "../utils/date";

const route = useRoute();
const router = useRouter();

const posts = ref([]);
const loading = ref(false);
const errorMessage = ref("");

const categories = [
  {
    icon: "🍴",
    title: "맛집",
    code: "restaurant",
    apiCode: "RESTAURANT",
    subtitle: "성심당부터 로컬 노포까지",
  },
  {
    icon: "📍",
    title: "명소 · 관광",
    code: "attraction",
    apiCode: "ATTRACTION",
    subtitle: "엑스포 · 수목원 · 대청호",
  },
  {
    icon: "🎉",
    title: "축제 · 행사",
    code: "festival",
    apiCode: "FESTIVAL",
    subtitle: "지금 열리는 대전의 축제",
  },
  {
    icon: "☕",
    title: "카페 · 디저트",
    code: "cafe_dessert",
    apiCode: "CAFE_DESSERT",
    subtitle: "감성 카페와 빵지순례",
  },
  {
    icon: "💡",
    title: "여행 팁",
    code: "travel_tip",
    apiCode: "TRAVEL_TIP",
    subtitle: "교통 · 주차 · 코스 꿀팁",
  },
  {
    icon: "💬",
    title: "동네 후기",
    code: "local_review",
    apiCode: "LOCAL_REVIEW",
    subtitle: "주민이 남기는 솔직 후기",
  },
];

const category = computed(() => String(route.params.category || "").toLowerCase());

const info = computed(() => {
  return categories.find((item) => item.code === category.value) ?? categories[0];
});

const goCategory = (code) => {
  router.push(`/posts/${code}`);
};

const fetchPosts = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/posts?category=${info.value.apiCode}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    console.log("목록 응답:", data);

    posts.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("게시글 조회 실패:", error);
    posts.value = [];
    errorMessage.value = "게시글을 불러오지 못했습니다.";
  } finally {
    loading.value = false;
  }
};

watch(
  () => route.params.category,
  () => {
    fetchPosts();
  },
  { immediate: true },
);
</script>

<template>
  <main class="post-page">
    <div class="container">
      <div class="category-tabs">
        <button
          v-for="item in categories"
          :key="item.code"
          type="button"
          class="category-tab"
          :class="{ active: item.code === category }"
          @click="goCategory(item.code)"
        >
          {{ item.title }}
        </button>
      </div>

      <div class="post-header">
        <div class="post-icon">
          {{ info.icon }}
        </div>

        <div class="post-header__text">
          <h1>{{ info.title }}</h1>
          <p>{{ info.subtitle }}</p>
        </div>

        <button type="button" class="write-btn">
          <SquarePen :size="18" :stroke-width="2.3" />
          글쓰기
        </button>
      </div>

      <div class="search-wrapper">
        <Search class="search-icon" :size="20" :stroke-width="2.2" />

        <input type="text" class="search-box" placeholder="이 게시판에서 검색" />
      </div>

      <p v-if="loading" class="post-message">게시글을 불러오는 중입니다.</p>

      <p v-else-if="errorMessage" class="post-message">
        {{ errorMessage }}
      </p>

      <div v-else-if="posts.length" class="post-list">
        <article v-for="post in posts" :key="post.id" class="post-card">
          <h2>{{ post.title }}</h2>

          <div class="post-meta">
            <span class="post-author">
              {{ post.nickname }}
            </span>

            <span> · {{ timeAgo(post.created_at) }} </span>
          </div>
        </article>
      </div>

      <p v-else class="post-message">아직 등록된 게시글이 없습니다.</p>
    </div>
  </main>
</template>
