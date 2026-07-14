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
      <button class="cancel">취소</button>

      <button class="submit" @click="submitPost">등록하기</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const categories = [
  {
    label: "맛집",
    value: "RESTAURANT",
  },
  {
    label: "명소·관광",
    value: "ATTRACTION",
  },
  {
    label: "축제·행사",
    value: "FESTIVAL",
  },
  {
    label: "카페·디저트",
    value: "CAFE_DESSERT",
  },
  {
    label: "여행 팁",
    value: "TRAVEL_TIP",
  },
  {
    label: "동네 후기",
    value: "LOCAL_REVIEW",
  },
];

const form = reactive({
  category: "RESTAURANT",
  title: "",
  nickname: "",
  password: "",
  content: "",
});

const submitPost = () => {
  console.log(form);
  alert("작성 테스트");
};
</script>

<style src="./PostWrite.css"></style>
