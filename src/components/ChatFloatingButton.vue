<script setup>
import { Bot } from "lucide-vue-next";
import { computed, nextTick, onMounted, ref } from "vue";
import { sendChatMessage } from "../api/chatApi";

const isOpen = ref(false);
const inputMessage = ref("");
const isLoading = ref(false);
const messageContainer = ref(null);

const messages = ref([
  {
    id: crypto.randomUUID(),
    role: "assistant",
    content:
      "안녕하세요! 대전 여행 도우미 townly 봇이에요. 맛집, 명소, 축제, 숙박 등 무엇이든 물어보세요.",
    places: [],
  },
]);

const quickQuestions = ["성심당 웨이팅 팁", "비 오는 날 갈 곳", "대청호 코스 추천"];

const canSend = computed(() => {
  return inputMessage.value.trim().length > 0 && !isLoading.value;
});

function toggleChat() {
  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    scrollToBottom();
  }
}

function closeChat() {
  isOpen.value = false;
}

function createHistory() {
  return messages.value
    .filter((message) => {
      return message.role === "user" || message.role === "assistant";
    })
    .slice(-8)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));
}

async function submitMessage(messageText = inputMessage.value) {
  const trimmedMessage = messageText.trim();

  if (!trimmedMessage || isLoading.value) {
    return;
  }

  // 현재 사용자 메시지를 추가하기 전의 대화만 history로 전달합니다.
  const history = createHistory();

  messages.value.push({
    id: crypto.randomUUID(),
    role: "user",
    content: trimmedMessage,
    places: [],
  });

  inputMessage.value = "";
  isLoading.value = true;

  await scrollToBottom();

  try {
    const response = await sendChatMessage(trimmedMessage, history);

    messages.value.push({
      id: crypto.randomUUID(),
      role: "assistant",
      content: response.answer,
      places: Array.isArray(response.places) ? response.places : [],
    });
  } catch (error) {
    messages.value.push({
      id: crypto.randomUUID(),
      role: "assistant",
      content: error instanceof Error ? error.message : "챗봇 연결 중 오류가 발생했습니다.",
      places: [],
      isError: true,
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
}

function selectQuickQuestion(question) {
  submitMessage(question);
}

function handleEnter(event) {
  // 한글 입력 조합 중 Enter가 중복 실행되는 것을 방지합니다.
  if (event.isComposing) {
    return;
  }

  if (event.shiftKey) {
    return;
  }

  event.preventDefault();
  submitMessage();
}

function openMap(place) {
  if (
    place.latitude !== null &&
    place.latitude !== undefined &&
    place.longitude !== null &&
    place.longitude !== undefined
  ) {
    const url =
      `https://map.kakao.com/link/map/` +
      `${encodeURIComponent(place.title)},` +
      `${place.latitude},${place.longitude}`;

    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  const keyword = [place.title, place.address].filter(Boolean).join(" ");

  const searchUrl = `https://map.kakao.com/link/search/` + encodeURIComponent(keyword);

  window.open(searchUrl, "_blank", "noopener,noreferrer");
}

async function scrollToBottom() {
  await nextTick();

  if (!messageContainer.value) {
    return;
  }

  messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
}

onMounted(() => {
  scrollToBottom();
});
</script>

<template>
  <div class="chat-widget">
    <Transition name="chat-panel">
      <section v-if="isOpen" class="chat-window" aria-label="townly 여행 챗봇">
        <header class="chat-header">
          <div class="chat-header__identity">
            <div class="chat-header__icon">✨</div>

            <div>
              <h2>townly 여행 도우미</h2>
              <p>대전 로컬 AI 가이드</p>
            </div>
          </div>

          <button
            type="button"
            class="chat-header__close"
            aria-label="챗봇 닫기"
            @click="closeChat"
          >
            ×
          </button>
        </header>

        <div ref="messageContainer" class="chat-messages" aria-live="polite">
          <article
            v-for="message in messages"
            :key="message.id"
            class="message-row"
            :class="{
              'message-row--user': message.role === 'user',
              'message-row--assistant': message.role === 'assistant',
            }"
          >
            <div
              class="message-bubble"
              :class="{
                'message-bubble--user': message.role === 'user',
                'message-bubble--assistant': message.role === 'assistant',
                'message-bubble--error': message.isError,
              }"
            >
              {{ message.content }}
            </div>

            <div v-if="message.role === 'assistant' && message.places?.length" class="place-list">
              <article v-for="place in message.places" :key="place.content_id" class="place-card">
                <img
                  v-if="place.image_url"
                  :src="place.image_url"
                  :alt="`${place.title} 대표 이미지`"
                  class="place-card__image"
                  loading="lazy"
                />

                <div v-else class="place-card__image-placeholder">📍</div>

                <div class="place-card__body">
                  <div class="place-card__category">
                    {{ place.category }}
                  </div>

                  <h3>{{ place.title }}</h3>

                  <p v-if="place.address">
                    {{ place.address }}
                  </p>

                  <p v-if="place.telephone">☎ {{ place.telephone }}</p>

                  <button type="button" class="place-card__map-button" @click="openMap(place)">
                    지도에서 보기
                  </button>
                </div>
              </article>
            </div>
          </article>

          <div v-if="isLoading" class="message-row message-row--assistant">
            <div class="message-bubble message-bubble--assistant typing" aria-label="답변 생성 중">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <footer class="chat-footer">
          <div class="quick-questions">
            <button
              v-for="question in quickQuestions"
              :key="question"
              type="button"
              :disabled="isLoading"
              @click="selectQuickQuestion(question)"
            >
              {{ question }}
            </button>
          </div>

          <div class="chat-input-area">
            <textarea
              v-model="inputMessage"
              rows="1"
              maxlength="500"
              placeholder="대전 여행, 무엇이든 물어보세요"
              aria-label="챗봇 메시지 입력"
              :disabled="isLoading"
              @keydown.enter="handleEnter"
            />

            <button
              type="button"
              class="send-button"
              aria-label="메시지 보내기"
              :disabled="!canSend"
              @click="submitMessage()"
            >
              ➤
            </button>
          </div>
        </footer>
      </section>
    </Transition>

    <button
      type="button"
      class="chat-floating-button"
      :class="{
        'chat-floating-button--open': isOpen,
      }"
      :aria-expanded="isOpen"
      aria-label="여행 챗봇 열기"
      @click="toggleChat"
    >
      <span v-if="isOpen">×</span>
      <Bot v-else :size="22" :stroke-width="2.3" />

      <span v-if="!isOpen"> 여행 챗봇 </span>
    </button>
  </div>
</template>

<style scoped>
.chat-widget {
  --chat-primary: #ef552f;
  --chat-primary-dark: #d94321;
  --chat-soft: #fff1eb;
  --chat-background: #fffdf9;
  --chat-border: #eadfd3;
  --chat-text: #29221d;
  --chat-muted: #8b7b6d;

  position: fixed;
  right: 22px;
  bottom: 20px;
  z-index: 1000;
  font-family:
    Pretendard,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.chat-floating-button {
  min-width: 116px;
  height: 52px;
  padding: 0 20px;
  border: 0;
  border-radius: 999px;
  background: var(--chat-primary);
  color: #ffffff;
  box-shadow:
    0 12px 30px rgb(116 55 29 / 24%),
    0 4px 10px rgb(116 55 29 / 14%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.chat-floating-button:hover {
  background: var(--chat-primary-dark);
  transform: translateY(-2px);
}

.chat-floating-button--open {
  min-width: 52px;
  width: 52px;
  padding: 0;
}

.chat-floating-button__icon {
  font-size: 18px;
  line-height: 1;
}

.chat-window {
  position: absolute;
  right: 0;
  bottom: 68px;
  width: min(380px, calc(100vw - 28px));
  height: min(560px, calc(100vh - 110px));
  border: 1px solid var(--chat-border);
  border-radius: 20px;
  background: var(--chat-background);
  box-shadow:
    0 26px 70px rgb(54 38 26 / 23%),
    0 8px 24px rgb(54 38 26 / 12%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chat-header {
  min-height: 58px;
  padding: 11px 14px;
  background: var(--chat-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-header__identity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-header__icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgb(255 255 255 / 18%);
  display: grid;
  place-items: center;
}

.chat-header h2 {
  margin: 0 0 2px;
  font-size: 14px;
  line-height: 1.2;
}

.chat-header p {
  margin: 0;
  color: rgb(255 255 255 / 78%);
  font-size: 11px;
}

.chat-header__close {
  width: 34px;
  height: 34px;
  border: 0;
  background: transparent;
  color: #ffffff;
  font-size: 25px;
  cursor: pointer;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 14px 18px;
  scroll-behavior: smooth;
}

.message-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}

.message-row--user {
  align-items: flex-end;
}

.message-row--assistant {
  align-items: flex-start;
}

.message-bubble {
  max-width: 82%;
  padding: 11px 13px;
  border-radius: 16px;
  font-size: 13px;
  line-height: 1.65;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.message-bubble--assistant {
  border: 1px solid var(--chat-border);
  border-top-left-radius: 5px;
  background: #ffffff;
  color: var(--chat-text);
}

.message-bubble--user {
  border-top-right-radius: 5px;
  background: var(--chat-primary);
  color: #ffffff;
}

.message-bubble--error {
  border-color: #efb4a4;
  background: #fff2ee;
  color: #b13c21;
}

.place-list {
  width: 90%;
  margin-top: 9px;
  display: grid;
  gap: 9px;
}

.place-card {
  border: 1px solid var(--chat-border);
  border-radius: 14px;
  background: #ffffff;
  overflow: hidden;
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
}

.place-card__image,
.place-card__image-placeholder {
  width: 88px;
  height: 100%;
  min-height: 120px;
}

.place-card__image {
  object-fit: cover;
}

.place-card__image-placeholder {
  background: var(--chat-soft);
  display: grid;
  place-items: center;
  font-size: 28px;
}

.place-card__body {
  min-width: 0;
  padding: 10px;
}

.place-card__category {
  display: inline-block;
  margin-bottom: 5px;
  padding: 3px 7px;
  border-radius: 999px;
  background: var(--chat-soft);
  color: var(--chat-primary-dark);
  font-size: 10px;
  font-weight: 700;
}

.place-card h3 {
  margin: 0 0 5px;
  color: var(--chat-text);
  font-size: 13px;
  line-height: 1.35;
}

.place-card p {
  margin: 3px 0;
  color: var(--chat-muted);
  font-size: 11px;
  line-height: 1.45;
}

.place-card__map-button {
  margin-top: 8px;
  padding: 6px 9px;
  border: 1px solid #f2b6a4;
  border-radius: 8px;
  background: #ffffff;
  color: var(--chat-primary-dark);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.place-card__map-button:hover {
  background: var(--chat-soft);
}

.chat-footer {
  padding: 10px 12px 12px;
  border-top: 1px solid var(--chat-border);
  background: #ffffff;
}

.quick-questions {
  margin-bottom: 8px;
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
}

.quick-questions::-webkit-scrollbar {
  display: none;
}

.quick-questions button {
  flex: 0 0 auto;
  padding: 6px 10px;
  border: 1px solid #e7d7c7;
  border-radius: 999px;
  background: #fbf4ea;
  color: #6c5949;
  font-size: 11px;
  cursor: pointer;
}

.quick-questions button:hover {
  background: #f6eadb;
}

.chat-input-area {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.chat-input-area textarea {
  flex: 1;
  min-height: 42px;
  max-height: 92px;
  padding: 11px 13px;
  resize: none;
  border: 1px solid var(--chat-border);
  border-radius: 13px;
  outline: none;
  background: #fcf7f0;
  color: var(--chat-text);
  font: inherit;
  font-size: 13px;
  line-height: 1.4;
}

.chat-input-area textarea:focus {
  border-color: #efa58e;
  box-shadow: 0 0 0 3px rgb(239 85 47 / 10%);
}

.send-button {
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border: 0;
  border-radius: 13px;
  background: var(--chat-primary);
  color: #ffffff;
  font-size: 17px;
  cursor: pointer;
}

.send-button:disabled {
  background: #efb5a4;
  cursor: not-allowed;
}

.typing {
  display: flex;
  align-items: center;
  gap: 5px;
}

.typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #b89b88;
  animation: typing-bounce 1.2s infinite;
}

.typing span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing span:nth-child(3) {
  animation-delay: 0.3s;
}

.chat-panel-enter-active,
.chat-panel-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  transform-origin: right bottom;
}

.chat-panel-enter-from,
.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}

@keyframes typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }

  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .chat-widget {
    right: 12px;
    bottom: 12px;
  }

  .chat-window {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100dvh;
    border: 0;
    border-radius: 0;
  }

  .chat-header {
    padding-top: max(11px, env(safe-area-inset-top));
  }

  .chat-floating-button--open {
    display: none;
  }

  .message-bubble {
    max-width: 88%;
  }

  .place-list {
    width: 96%;
  }
}
</style>
