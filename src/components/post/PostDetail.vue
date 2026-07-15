<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Share2, ChevronLeft, Pencil, Trash2 } from "lucide-vue-next";
import PasswordModal from "../common/PasswordModal.vue";

import { timeAgo } from "../../utils/date";

const route = useRoute();
const router = useRouter();

const post = ref(null);
const loading = ref(false);
const errorMessage = ref("");
const showPasswordModal = ref(false);

const modalType = ref("");

const categoryMap = {
  RESTAURANT: {
    label: "맛집",
    slug: "restaurant",
  },
  ATTRACTION: {
    label: "명소 · 관광",
    slug: "attraction",
  },
  FESTIVAL: {
    label: "축제 · 행사",
    slug: "festival",
  },
  CAFE_DESSERT: {
    label: "카페 · 디저트",
    slug: "cafe_dessert",
  },
  TRAVEL_TIP: {
    label: "여행 팁",
    slug: "travel_tip",
  },
  LOCAL_REVIEW: {
    label: "동네 후기",
    slug: "local_review",
  },
};

const categoryInfo = computed(() => {
  return (
    categoryMap[post.value?.category] ?? {
      label: "게시판",
      slug: "restaurant",
    }
  );
});

const fetchPost = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch(`http://localhost:8000/api/posts/${route.params.id}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    post.value = await response.json();
  } catch (error) {
    console.error("게시글 상세 조회 실패:", error);
    post.value = null;
    errorMessage.value = "게시글을 불러오지 못했습니다.";
  } finally {
    loading.value = false;
  }
};

const goBackToList = () => {
  router.push(`/posts/${categoryInfo.value.slug}`);
};

const openEditModal = () => {
  modalType.value = "edit";

  showPasswordModal.value = true;
};

const openDeleteModal = () => {
  modalType.value = "delete";

  showPasswordModal.value = true;
};

const confirmPassword = async (password) => {
  // 수정
  if (modalType.value === "edit") {
    sessionStorage.setItem("editPassword", password);

    router.push(`/posts/edit/${post.value.id}`);
  }

  // 삭제
  if (modalType.value === "delete") {
    const response = await fetch(`http://localhost:8000/api/posts/${post.value.id}`, {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        password,
      }),
    });

    if (response.ok) {
      alert("삭제되었습니다.");

      router.push(`/posts/${categoryInfo.value.slug}`);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  }

  showPasswordModal.value = false;
};

watch(
  () => route.params.id,
  () => {
    fetchPost();
  },
  { immediate: true },
);
</script>

<template>
  <div class="post-detail-container">
    <button type="button" class="post-detail-back" @click="goBackToList">
      <ChevronLeft :size="18" />
      {{ categoryInfo.label }} 게시판
    </button>

    <p v-if="loading" class="post-detail-message">게시글을 불러오는 중입니다.</p>

    <p v-else-if="errorMessage" class="post-detail-message">
      {{ errorMessage }}
    </p>

    <article v-else-if="post" class="post-detail-card">
      <span class="post-detail-category">
        {{ categoryInfo.label }}
      </span>

      <h1 class="post-detail-title">
        {{ post.title }}
      </h1>

      <div class="post-detail-author">
        <div class="post-detail-avatar">
          {{ post.nickname?.slice(0, 1) }}
        </div>

        <div>
          <strong>{{ post.nickname }}</strong>
          <p>{{ timeAgo(post.created_at) }}</p>
        </div>
      </div>

      <div class="post-detail-divider"></div>

      <div class="post-detail-content">
        {{ post.content }}
      </div>

      <div class="post-detail-actions">
        <div class="post-detail-actions-left">
          <button type="button" class="post-detail-action-button" @click="sharePost">
            <Share2 :size="17" />
            공유하기
          </button>
        </div>

        <div class="post-detail-actions-right">
          <button type="button" class="post-detail-action-button" @click="openEditModal">
            <Pencil :size="17" />
            수정
          </button>

          <button type="button" class="post-detail-action-button" @click="openDeleteModal">
            <Trash2 :size="17" />
            삭제
          </button>
        </div>
      </div>
    </article>
  </div>

  <PasswordModal
    v-if="showPasswordModal"
    :title="modalType === 'delete' ? '게시글 삭제' : '게시글 수정'"
    @confirm="confirmPassword"
    @close="showPasswordModal = false"
  />
</template>

<style src="./PostDetail.css"></style>
