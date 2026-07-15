<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goWrite = () => {
  router.push("/posts/write");
};
</script>

<template>
  <section class="cta">
    <div class="container">
      <div class="cta-box">
        <div>
          <h2>대전 여행, 궁금한 게 있나요?</h2>
          <p>우측 하단 챗봇에게 물어보거나 직접 글을 남겨보세요.</p>
        </div>

        <button class="cta-btn" @click="goWrite">글쓰기 →</button>
      </div>
    </div>
  </section>
</template>
