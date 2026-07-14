<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { timeAgo } from "../utils/date";


const route = useRoute();
const router = useRouter();


const posts = ref([]);

const category = ref(route.params.category);


const categories = [
  {
    icon: "🍴",
    title: "맛집",
    code: "RESTAURANT",
    subtitle: "성심당부터 로컬 노포까지",
  },
  {
    icon: "📍",
    title: "명소 · 관광",
    code: "ATTRACTION",
    subtitle: "엑스포 · 수목원 · 대청호",
  },
  {
    icon: "🎉",
    title: "축제 · 행사",
    code: "FESTIVAL",
    subtitle: "지금 열리는 대전의 축제",
  },
  {
    icon: "☕",
    title: "카페 · 디저트",
    code: "CAFE_DESSERT",
    subtitle: "감성 카페와 빵지순례",
  },
  {
    icon: "💡",
    title: "여행 팁",
    code: "TRAVEL_TIP",
    subtitle: "교통 · 주차 · 코스 꿀팁",
  },
  {
    icon: "💬",
    title: "동네 후기",
    code: "LOCAL_REVIEW",
    subtitle: "주민이 남기는 솔직 후기",
  },
];


const info = ref(
  categories.find(
    (item) => item.code === category.value
  )
);


const goCategory = (code) => {
  router.push(`/posts/${code}`);
};


const fetchPosts = async () => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/posts?category=${category.value}`
    );

    const data = await response.json();

    posts.value = data;

  } catch (error) {
    console.error("게시글 조회 실패:", error);
  }
};


watch(
  () => route.params.category,
  (newCategory) => {

    category.value = newCategory;

    info.value = categories.find(
      (item) => item.code === newCategory
    );

    fetchPosts();

  }
);


onMounted(fetchPosts);

</script>


<template>
  <section class="post-page">

    <div class="container">


      <!-- 카테고리 탭 -->
      <div class="category-tabs">

        <button
          v-for="item in categories"
          :key="item.code"
          class="category-tab"
          :class="{
            active: item.code === category
          }"
          @click="goCategory(item.code)"
        >
          {{ item.title }}
        </button>

      </div>



      <!-- 게시판 헤더 -->
      <div class="post-header">


        <div class="post-icon">
          {{ info.icon }}
        </div>


        <div>

          <h1>
            {{ info.title }}
          </h1>

          <p>
            {{ info.subtitle }}
          </p>

        </div>



        <button class="write-btn">
          ✎ 글쓰기
        </button>


      </div>




      <!-- 검색 -->

      <input
        class="search-box"
        placeholder="이 게시판에서 검색"
      />




      <!-- 게시글 목록 -->

      <div class="post-list">


        <article
          v-for="post in posts"
          :key="post.id"
          class="post-card"
        >


          <h2>
            {{ post.title }}
          </h2>



          <div class="post-meta">

            <span>
              {{ post.nickname }}
            </span>


            <span>
            · {{ timeAgo(post.created_at) }}
            </span>

          </div>



        </article>



      </div>


    </div>

  </section>
</template>