<template>
  <section v-if="products?.nodes">
    <div id="product-container" class="tw-flex tw-flex-wrap tw-justify-center tw-items-center">
      <template v-for="product in products?.nodes">
        <ProductCard :product="product" />
      </template>
    </div>
  </section>
</template>

<script setup>
// ProductsShowAll.vue
// import { mdiCartPlus } from '@mdi/font'

import { filteredVariantPrice, addProductToCart } from "@/utils/functions";
import ProductCard from "@/components/Products/ProductCard.vue";

const props = defineProps({
  products: {type: Object, required: true}
});

const config = useRuntimeConfig();

const productImage = (product) =>
  product.image ? product.image.sourceUrl : config.placeholderImage;



const addToCart = async (product) => {
  const result = await addProductToCart(product);
  if(result !== false) {
    errMsg = result.message
  }
}
</script>

<style scoped>
a:hover {
  border: none;
}
.slide-group-wrapper {
  overflow: hidden;
}

.hide-item {
  display: none;
}

</style>