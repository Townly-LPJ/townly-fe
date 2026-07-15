<template>
  <div class="write-container">
    <h1>새 글 작성</h1>
    <p class="subtitle">회원가입 없이 자유롭게 작성하세요.</p>
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
    <div class="field">
      <label>제목</label>
      <input v-model="form.title" placeholder="제목을 입력하세요" />
    </div>
    <div class="field">
      <label>사진 첨부</label>
      <input type="file" @change="handleFileChange" accept="image/*" />
      <div v-if="uploading">업로드 중...</div>
    </div>
    <div class="row">
      <div class="field">
        <label>닉네임</label>
        <input v-model="form.nickname" placeholder="익명" />
      </div>
      <div class="field">
        <label>비밀번호 <span>(수정·삭제용)</span></label>
        <input type="password" v-model="form.password" placeholder="4자 이상" />
      </div>
    </div>
    <div class="field">
      <label>내용</label>
      <textarea
        v-model="form.content"
        placeholder="대전 여행 정보를 자유롭게 남겨주세요."
      ></textarea>
    </div>
    <div class="actions">
      <button class="cancel" @click="cancelWrite">취소</button>
      <button class="submit" @click="submitPost" :disabled="isSubmitting">
        {{ isSubmitting ? "등록 중..." : "등록하기" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/lib/supabase";

const router = useRouter();
const isSubmitting = ref(false);
const uploading = ref(false);

const categories = [
  { label: "맛집", value: "RESTAURANT", slug: "restaurant" },
  { label: "명소 · 관광", value: "ATTRACTION", slug: "attraction" },
  { label: "축제 · 행사", value: "FESTIVAL", slug: "festival" },
  { label: "카페 · 디저트", value: "CAFE_DESSERT", slug: "cafe_dessert" },
  { label: "여행 팁", value: "TRAVEL_TIP", slug: "travel_tip" },
  { label: "동네 후기", value: "LOCAL_REVIEW", slug: "local_review" },
];

const form = reactive({
  category: "RESTAURANT",
  title: "",
  nickname: "",
  password: "",
  content: "",
  image_url: null,
});

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    uploading.value = true;

    // 1. 파일 이름 생성: 0.을 제거하고 현재 시간 + 랜덤 조합 사용
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 10000)}.${fileExt}`;

    // 2. 경로 설정
    const filePath = fileName;

    // 3. 업로드
    const { error: uploadError } = await supabase.storage
      .from("townly-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 4. URL 가져오기
    const { data } = supabase.storage.from("townly-images").getPublicUrl(filePath);

    form.image_url = data.publicUrl;
  } catch (error) {
    console.error("업로드 에러:", error);
    alert("이미지 업로드 실패: " + error.message);
  } finally {
    uploading.value = false;
  }
};

const submitPost = async () => {
  isSubmitting.value = true;
  try {
    const response = await fetch("http://127.0.0.1:8000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });
    if (!response.ok) throw new Error("등록 실패");
    const selectedCategory = categories.find((c) => c.value === form.category);
    router.push(`/posts/${selectedCategory.slug}`);
  } catch (error) {
    alert(error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const cancelWrite = () => router.back();
</script>

<style src="./PostWrite.css"></style>
