<template>
  <div>
    <h1>Thank you for your order!</h1>
    <h2>Please check your email for an order confirmation</h2>
  </div>
</template>

<script setup>


onBeforeMount(() => {
});

useHead({
  title: "Order placed",
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

<style scoped>
h1 {
  @apply tw-h-10 tw-p-6 tw-text-3xl tw-font-bold tw-text-center;
}

h2 {
  @apply tw-h-10 tw-p-6 tw-text-2xl tw-font-bold tw-text-center tw-mt-4;
}
</style>
