<script setup>
import { ref } from "vue";

const props = defineProps({
  title: String,
});

const emit = defineEmits(["close", "confirm"]);

const password = ref("");

const submit = () => {
  emit("confirm", password.value);
};
</script>

<template>
  <div class="modal-overlay">
    <div class="password-modal">
      <button class="close" @click="emit('close')">×</button>

      <h2>
        {{ title }}
      </h2>

      <p>작성 시 입력한 비밀번호를 입력해주세요.</p>

      <input v-model="password" type="password" placeholder="비밀번호" />

      <button class="confirm" @click="submit">확인</button>
    </div>
  </div>
</template>

<style src="./PasswordModal.css"></style>
