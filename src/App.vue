<script setup>
import SiteHeader from "./components/SiteHeader.vue";
import SiteFooter from "./components/SiteFooter.vue";
import ChatFloatingButton from "./components/ChatFloatingButton.vue";
</script>


<template>
  <div class="app-shell">

    <SiteHeader />

    <router-view />

    <SiteFooter />

    <ChatFloatingButton />

  </div>
</template>