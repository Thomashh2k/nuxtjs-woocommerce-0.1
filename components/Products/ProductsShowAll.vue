<template>
  <section v-if="products?.nodes">
    <div id="product-container" class="tw-flex tw-flex-wrap tw-justify-center tw-items-center">
      <template v-for="product in products?.nodes">
        <v-card
          v-if="product.slug"
          :key="product.id"
          style="z-index: 0"
          class="card-bg-color card-height card-width tw-text-black lg:tw-mt-6 md:tw-mt-5 sm:tw-mt-5 max-[1280px]:tw-mt-5 sm:tw-w1/2 md:tw-w-1/3 lg:tw-w-1/4 lg:tw-mr-4 md:tw-mr-3 sm:tw-mr-3 max-[1280px]:tw-mr-2 hover:shadow-2xl card-bg-color"
        >
        <!-- tw-bg-violet-900 -->
          <NuxtLink
            class="tw-cursor-pointer"
            :to="{
              path: '/product/' + product.slug,
              query: { id: product.databaseId },
            }"
          >
              <img
                id="product-image"
                class="tw-border tw-w-4/5 lg:tw-h-72 md:tw-h-56 sm:tw-h-56 max-[768px]:tw-h-56 tw-rounded tw-drop-shadow-lg tw-transition tw-duration-500 tw-ease-in-out tw-transform tw-cursor-pointer lg:tw-ml-0 tw-w-full  tw-hover:tw-scale-95"
                :alt="product.name"
                :src="productImage(product)"
              />
                <div class="tw-flex tw-justify-center tw-pt-3 hover:tw-underline tw-decoration-purple-50">
                  <p class="lg:tw-text-lg max-[1280px]:tw-text-xs tw-font-bold tw-truncate tw-text-center tw-cursor-pointer tw-text-purple-50">
                    {{ product.name }}
                  </p>
                </div>
                <div class="tw-flex tw-justify-center tw-text-sm">
                  <div v-if="product.stockStatus === 'OUT_OF_STOCK'" style="color:rgb(244, 67, 54);">
                    Nicht vorrätig
                  </div>
                  <div v-else style="color:rgb(76, 175, 80);">
                    Auf Lager
                  </div>
                </div>
                <div v-if="product.onSale" class="tw-flex tw-justify-start tw-m-2 tw-mb-0 lg:tw-text-sm  hover:tw-underline tw-decoration-purple-50  max-[1280px]:tw-text-base">
                  <div class="tw-text-purple-50 tw-line-through">
                    <span v-if="product.variations" v-html="filteredVariantPrice(product.price, 'right')"></span>
                    <span v-else v-html="product.regularPrice"></span>
                  </div>
                  <div class="tw-ml-4 tw-text-xl tw-text-purple-50">
                    <span v-if="product.variations" v-html="filteredVariantPrice(product.price)"></span>
                    <span v-else v-html="product.salePrice"></span>
                  </div>
                </div>
                <div v-else>
                  <p class="tw-m-2 tw-text-xl tw-text-center tw-text-purple-50 hover:tw-underline tw-decoration-purple-50  max-[1280px]:tw-text-base" v-html="product.price"></p>
                </div>
          </NuxtLink>
          <v-card-actions style="z-index: 10;"  class="tw-absolute tw-items-center tw-bottom-0 tw-left-28 max-[1280px]:tw-left-16">
            <div>
              <v-btn-toggle color="success" variant="outlined" rounded="xl" class="tw-w-60 max-[1280px]:tw-h-4 max-[1280px]:tw-pt-2">
                <v-btn style="border: 2px solid rgb(76, 175, 80); color: rgb(76, 175, 80); border-right: unset;" :disabled="product.stockStatus === 'OUT_OF_STOCK'" class="tw-text-xl action-btns" icon="mdi-cash-register" @click="addProductToCart(product)"/>
                <v-btn style="border: 2px solid rgb(76, 175, 80); color: rgb(76, 175, 80); border-left: unset; margin-inline-start: unset;" :disabled="product.stockStatus === 'OUT_OF_STOCK'" class="tw-text-xl action-btns" icon="mdi-cart-plus" @click="addProductToCart(product)"/>
              </v-btn-toggle>
            </div>
          </v-card-actions>
        </v-card>
      </template>
    </div>
  </section>
</template>

<script setup>
// ProductsShowAll.vue
// import { mdiCartPlus } from '@mdi/font'

import { filteredVariantPrice, addProductToCart } from "@/utils/functions";

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
.card-height {
  height: 30rem;
}
.card-width {
  max-width: 340px;
}
@media (max-width: 1280px) {
  .card-width {
    max-width: 240px;
  }
  .card-height {
    height: 24.5rem;
  }
}

.card-bg-color {
  /* background: rgb(26, 6, 58) !important; */
  background-color: rgb(76 29 149 / var(--tw-bg-opacity));
}
</style>