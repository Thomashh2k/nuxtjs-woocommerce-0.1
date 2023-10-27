<template>
  <!DOCTYPE html>
  <Html lang="en">
    <Body
      class="tw-antialiased tw-duration-300 tw-transition-colors tw-text-gray-800 dark:tw-text-gray-200 tw-bg-white body-color tw-m-0 tw-h-screen"
    >
      <NuxtLayout>
        <NuxtLoadingIndicator :height="5" :duration="3000" :throttle="400" />
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </Html>
</template>

<script setup>

import { ref, onBeforeMount, onUnmounted} from 'vue'
onBeforeMount(() => {
  window.addEventListener('scroll', handleScollEvent());
  console.log('og-gaming.store-version: 1.0.0b')
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScollEvent());
});

let fixedNavBar = ref(false)

useHead({
  title: "Index",
  titleTemplate: "%s - Nuxt 3 Woocommerce",
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      hid: "description",
      name: "description",
      content: "Nuxt 3 Woocommerce",
    },
  ],
  link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
});
</script>

<style>
.body-color {
  background: rgb(26, 6, 58);
}
.page-enter-active {
  transition: all 0.1s ease-out;
}
.page-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.page-enter-from,
.page-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.layout-enter-active {
  transition: all 0.1s ease-out;
}
.layout-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.layout-enter-from,
.layout-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
