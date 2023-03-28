<template>
  <v-row>
    <v-col md="1"></v-col>
    <v-col cols="12" md="10">
      <v-row>
        <v-col cols="12" md="8">
          <CheckoutForm class="tw-w-full tw-h-full"/>
        </v-col>
        <v-col cols="12" md="4" class="tw-flex tw-items-center">
          <CartContents class="tw-w-full" style="height: 87%;"/>
        </v-col>
      </v-row>
    </v-col>
    <v-col md="1"></v-col>
  </v-row>
</template>

<script setup>
useHead({
  title: "Checkout",
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
