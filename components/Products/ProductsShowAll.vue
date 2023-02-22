<template>
  <div v-if="data?.products?.nodes">
    <section>
      <div id="product-container" class="tw-flex tw-flex-wrap tw-justify-center tw-items-center">
        <template v-for="product in data.products.nodes">

            <v-card
              v-if="product.slug"
              :key="product.id"
              style="width: 351px; z-index: 0"
              class="card-bg-color card-height tw-text-black tw-mt-6 sm:tw-w1/2 md:tw-w-1/3 lg:tw-w-1/4 lg:tw-mr-4 hover:shadow-2xl card-bg-color"
            >
            <!-- tw-bg-violet-900 -->
            <NuxtLink
              class="tw-cursor-pointer tw-decoration-purple-50 hover:tw-underline"
              :to="{
                path: '/product/' + product.slug,
                query: { id: product.databaseId },
              }"
            >
                <img
                  id="product-image"
                  class="tw-border tw-mx-auto tw-w-4/5 lg:tw-h-4/6 tw-rounded tw-drop-shadow-lg tw-transition tw-duration-500 tw-ease-in-out tw-transform tw-cursor-pointer lg:tw-ml-0 lg:tw-w-full  tw-hover:tw-scale-95"
                  :alt="product.name"
                  :src="productImage(product)"
                />
                  <div class="tw-flex tw-justify-center tw-pt-3">
                    <p class="tw-text-lg tw-font-bold tw-text-center tw-cursor-pointer tw-text-purple-50">
                      {{ product.name }}
                    </p>
                  </div>
                  <div v-if="product.onSale" class="tw-flex tw-justify-center tw-mt-2">
                    <div class="tw-text-lg tw-text-purple-50 tw-line-through">
                      <span v-if="product.variations" v-html="filteredVariantPrice(product.price, 'right')"></span>
                      <span v-else v-html="product.regularPrice"></span>
                    </div>
                    <div class="tw-ml-4 tw-text-xl tw-text-purple-50">
                      <span v-if="product.variations" v-html="filteredVariantPrice(product.price)"></span>
                      <span v-else v-html="product.salePrice"></span>
                    </div>
                  </div>
                  <div v-else>
                    <p class="tw-mt-2 tw-text-xl tw-text-center tw-text-purple-50" v-html="product.price"></p>
                  </div>
                </NuxtLink>
                <v-card-actions class="tw-absolute tw-bottom-0 tw-right-0" style="z-index: 10;">
                  <v-btn color="success" class="tw-text-xl" rounded icon="mdi mdi-cart-plus" />
                </v-card-actions>
              </v-card>
        </template>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import FETCH_ALL_PRODUCTS_QUERY from "@/apollo/queries/FETCH_ALL_PRODUCTS_QUERY.gql";
import GET_PRODUCTS_FROM_CATEGORY_QUERY from "@/apollo/queries/GET_PRODUCTS_FROM_CATEGORY_QUERY.gql";
// import { mdiCartPlus } from '@mdi/font'

import { filteredVariantPrice } from "@/utils/functions";

const props = defineProps({
  categoryId: { type: String, required: false },
  categorySlug: { type: String, required: false },
});

const config = useRuntimeConfig();

const productImage = (product) =>
  product.image ? product.image.sourceUrl : config.placeholderImage;

const productVariables = { limit: 99 };

let data = {}

if (props.categoryId) {
  const categoryVariables = { id: props.categoryId, slug: props.categorySlug };
  const result = await useAsyncQuery(
    GET_PRODUCTS_FROM_CATEGORY_QUERY,
    categoryVariables
  );
  await result.execute();
  debugger
  data = result.data.value.productCategory;
} else {
  const result = await useAsyncQuery(
    FETCH_ALL_PRODUCTS_QUERY,
    productVariables
  );
  await result.execute();
  data = result.data.value

}
</script>

<style scoped>
a:hover {
  border: none;
}
.card-height {
  height: 28rem;
}
.card-bg-color {
  /* background: rgb(26, 6, 58) !important; */
  background-color: rgb(76 29 149 / var(--tw-bg-opacity));
}
</style>