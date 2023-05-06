<template>
  <ProductsShowAll :products="data" />
</template>

<script setup>
import FETCH_ALL_PRODUCTS_QUERY from "@/apollo/queries/FETCH_ALL_PRODUCTS_QUERY.gql";
useHead({
  title: "Products",
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

let data = {}
let errMsg = undefined
const productVariables = { limit: 99 };

const result = await useAsyncQuery(
  FETCH_ALL_PRODUCTS_QUERY,
  productVariables
);
await result.execute();
data = result.data.value.products

</script>
