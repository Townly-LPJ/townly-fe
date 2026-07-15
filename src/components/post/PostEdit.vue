<script setup>
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const route = useRoute();
const router = useRouter();

const password = sessionStorage.getItem("editPassword");

const form = reactive({
  category: "",
  title: "",
  nickname: "",
  content: "",
});

const categories = [
  {
    label: "맛집",
    value: "RESTAURANT",
    slug: "restaurant",
  },
  {
    label: "명소 · 관광",
    value: "ATTRACTION",
    slug: "attraction",
  },
  {
    label: "축제 · 행사",
    value: "FESTIVAL",
    slug: "festival",
  },
  {
    label: "카페 · 디저트",
    value: "CAFE_DESSERT",
    slug: "cafe_dessert",
  },
  {
    label: "여행 팁",
    value: "TRAVEL_TIP",
    slug: "travel_tip",
  },
  {
    label: "동네 후기",
    value: "LOCAL_REVIEW",
    slug: "local_review",
  },
];

// 기존 게시글 조회
const fetchPost = async () => {
  const response = await fetch(`${API_BASE_URL}/api/posts/${route.params.id}`);
  const data = await response.json();

  form.category = data.category;
  form.title = data.title;
  form.nickname = data.nickname;
  form.content = data.content;
};

// 수정 요청
const updatePost = async () => {
  const response = await fetch(`${API_BASE_URL}/api/posts/${route.params.id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      category: form.category,
      title: form.title,
      content: form.content,
      password,
    }),
  });

  if (response.ok) {
    sessionStorage.removeItem("editPassword");

    alert("수정되었습니다.");

    router.push(`/posts/detail/${route.params.id}`);
  } else {
    alert("비밀번호가 틀렸습니다.");
  }
};

onMounted(fetchPost);
</script>

<template>
  <div class="write-container">
    <h1>게시글 수정</h1>

    <p class="subtitle">작성한 게시글을 수정합니다.</p>

    <!-- 카테고리 -->
    <div class="field">
      <label>카테고리</label>

      <div class="category-list">
        <button
          v-for="item in categories"
          :key="item.value"
          :class="{ active: form.category === item.value }"
          @click="form.category = item.value"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <!-- 제목 -->
    <div class="field">
      <label>제목</label>

      <input v-model="form.title" placeholder="제목을 입력하세요" />
    </div>

    <!-- 닉네임 / 비밀번호 -->
    <div class="row">
      <div class="field">
        <label>작성자</label>

        <input :value="form.nickname" disabled />
      </div>
    </div>

    <!-- 내용 -->
    <div class="field">
      <label>내용</label>

      <textarea
        v-model="form.content"
        placeholder="대전 여행 정보를 자유롭게 남겨주세요."
      ></textarea>
    </div>

    <!-- 버튼 -->
    <div class="actions">
      <button class="cancel" @click="cancelWrite">취소</button>

      <button class="submit" @click="updatePost">수정 완료</button>
    </div>
  </div>
</template>
