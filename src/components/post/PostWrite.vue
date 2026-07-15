<template>
  <div class="write-container">
    <h1>새 글 작성</h1>
    <p class="subtitle">회원가입 없이 자유롭게 작성하세요.</p>

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
        <label>닉네임</label>

        <input v-model="form.nickname" placeholder="익명" />
      </div>

      <div class="field">
        <label>
          비밀번호
          <span>(수정·삭제용)</span>
        </label>

        <input type="password" v-model="form.password" placeholder="4자 이상" />
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

      <button class="submit" @click="submitPost">등록하기</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const isSubmitting = ref(false);
const errorMessage = ref("");

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

const form = reactive({
  category: "RESTAURANT",
  title: "",
  nickname: "",
  password: "",
  content: "",
});

onMounted(() => {
  const queryCategory = String(route.query.category ?? "");

  const exists = categories.some((item) => item.value === queryCategory);

  if (exists) {
    form.category = queryCategory;
  }
});

const validateForm = () => {
  if (!form.title.trim()) {
    return "제목을 입력해 주세요.";
  }

  if (!form.content.trim()) {
    return "내용을 입력해 주세요.";
  }

  if (!form.nickname.trim()) {
    return "닉네임을 입력해 주세요.";
  }

  if (form.password.length < 4) {
    return "비밀번호는 4자 이상 입력해 주세요.";
  }

  return "";
};

const submitPost = async () => {
  const validationMessage = validateForm();

  if (validationMessage) {
    errorMessage.value = validationMessage;
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch("http://127.0.0.1:8000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: form.category,
        title: form.title.trim(),
        content: form.content.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      throw new Error(errorData?.detail ?? `게시글 등록에 실패했습니다. (${response.status})`);
    }

    await response.json().catch(() => null);

    const selectedCategory = categories.find((item) => item.value === form.category);

    router.push(`/posts/${selectedCategory.slug}`);
  } catch (error) {
    console.error("게시글 등록 실패:", error);

    errorMessage.value =
      error instanceof Error ? error.message : "게시글 등록 중 오류가 발생했습니다.";
  } finally {
    isSubmitting.value = false;
  }
};

const cancelWrite = () => {
  router.back();
};
</script>

<style src="./PostWrite.css"></style>
