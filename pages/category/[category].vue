<!-- OBSOLETE -->

<template>
  <div>
    <CategoryShowAll />
    <ProductsShowAll
      :products="data"
    />
  </div>
</template>

<script setup>
import GET_PRODUCTS_FROM_CATEGORY_QUERY from "@/apollo/queries/GET_PRODUCTS_FROM_CATEGORY_QUERY.gql";
const route = useRoute();

useHead({
  title: route.params.category,
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

let data = {};
let errMsg = undefined;
const categoryVariables = { id: route.query.id, slug: route.path };
const result = await useAsyncQuery(
  GET_PRODUCTS_FROM_CATEGORY_QUERY,
  categoryVariables
);
await result.execute();
data = result.data.value.productCategory.products;

</script>
