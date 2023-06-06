<template>
  <section ref="section">
    <v-window v-if="productsPages.length > 0" center-active show-arrows id="product-container" class="slide-group-wrapper">
      <template v-slot:prev="{ props }">
        <v-btn icon="mdi-chevron-left" @click="props.onClick" class="btn-bg-color"></v-btn>
      </template>
      <template v-slot:next="{ props }">
        <v-btn icon="mdi-chevron-right" @click="props.onClick" class="btn-bg-color"></v-btn>
      </template>
      <v-window-item v-for="(productPage, index) in productsPages" :key="index" class="tw-flex tw-flex-row">
        <v-card
          v-for="(product) in productPage"
          :key="product?.id"
          style="z-index: 0;"
          class="card-bg-color card-height card-width tw-text-black lg:tw-mt-6 md:tw-mt-5 sm:tw-mt-5 max-[1280px]:tw-mt-5 sm:tw-w1/2 md:tw-w-1/3 lg:tw-w-1/4 lg:tw-mr-4 md:tw-mr-3 sm:tw-mr-3 max-[1280px]:tw-mr-2 hover:shadow-2xl card-bg-color"
        >
          <!-- :class="{ 'hide-item': isItemVisible(index) }" -->
        <!-- tw-bg-violet-900 -->
          <NuxtLink
            v-if="product?.slug"
            class="tw-cursor-pointer"
            :to="{
              path: '/product/' + product?.slug,
              query: { id: product?.databaseId },
            }"
          >
              <img
                id="product-image"
                class="tw-border 2xl:tw-h-72 lg:tw-h-56 md:tw-h-56 sm:tw-h-56 tw-rounded tw-drop-shadow-lg tw-transition tw-duration-500 tw-ease-in-out tw-transform tw-cursor-pointer lg:tw-ml-0 tw-w-full  tw-hover:tw-scale-95"
                :alt="product.name"
                :src="productImage(product)"
              />
                <div class="tw-flex tw-justify-center tw-pt-3 hover:tw-underline tw-decoration-purple-50">
                  <p class="lg:tw-text-lg max-[1280px]:tw-text-xs tw-font-bold tw-text-center tw-truncate tw-cursor-pointer tw-text-purple-50">
                    {{ product?.name }}
                  </p>
                </div>
                <div class="tw-flex tw-justify-center tw-text-sm">
                  <div v-if="product?.stockStatus === 'OUT_OF_STOCK'" style="color:rgb(244, 67, 54);">
                    Nicht vorrätig
                  </div>
                  <div v-else style="color:rgb(76, 175, 80);">
                    Auf Lager
                  </div>
                </div>
                <div v-if="product?.onSale" class="tw-flex tw-justify-start tw-m-2 tw-mb-0 lg:tw-text-sm  hover:tw-underline tw-decoration-purple-50  max-[1280px]:tw-text-base">
                  <div class="tw-text-purple-50 tw-line-through">
                    <span v-if="product?.variations" v-html="filteredVariantPrice(product?.price, 'right')"></span>
                    <span v-else v-html="product?.regularPrice"></span>
                  </div>
                  <div class="tw-ml-4 tw-text-xl tw-text-purple-50">
                    <span v-if="product?.variations" v-html="filteredVariantPrice(product?.price)"></span>
                    <span v-else v-html="product?.salePrice"></span>
                  </div>
                </div>
                <div v-else>
                  <p class="tw-m-2 tw-text-xl tw-text-center tw-text-purple-50 hover:tw-underline tw-decoration-purple-50  max-[1280px]:tw-text-base" v-html="product?.price"></p>
                </div>
          </NuxtLink>
          <v-card-actions style="z-index: 10;"  class="tw-absolute tw-bottom-0 tw-left-28 max-[1280px]:tw-left-16">
              <v-btn-toggle color="success" variant="outlined" rounded="xl" class="max-[1280px]:tw-h-4 max-[1280px]:tw-pt-2 max-[960px]:tw-hidden">
                <v-btn style="border: 2px solid rgb(76, 175, 80); color: rgb(76, 175, 80); border-right: unset;" :disabled="product?.stockStatus === 'OUT_OF_STOCK'" icon="mdi-cash-register" @click="addToCart(product)" />
                <v-btn style="border: 2px solid rgb(76, 175, 80); color: rgb(76, 175, 80); border-left: unset; margin-inline-start: unset;" :disabled="product?.stockStatus === 'OUT_OF_STOCK'" icon="mdi-cart-plus" @click="addToCart(product)" />
              </v-btn-toggle>
          </v-card-actions>
        </v-card>
      </v-window-item>
    </v-window>

  </section>
</template>
  
<script>
import { filteredVariantPrice, addProductToCart } from "@/utils/functions";
import * as labsComponents from 'vuetify/labs/components'

export default {
  name: 'ProductsRow',
  props: {
    products: {type: Object, required: true}
  },
  components: {
    ...labsComponents,
  },
  mounted() {
    debugger
    if(process.client) {
      this.productsLength = this.productsGroupLength()
  
      this.productsPages = this.convertToTwoDimensionalArray(this.products.nodes, this.productsLength)
    }
  },
  data() {
    return {
      productsPages: [],
      productsLength: null
    }
  },
  computed: {
    cardWidth() {
      if(window.innerWidth > 1536) {
        return 340

      } else if(window.innerWidth < 1536) {
        return 240

      } if(window.innerWidth < 1280) {
        return 240

      } if(window.innerWidth < 960) {
        return 200
      } 
    }
  },
  methods: {
    productImage(product) {
      const config = useRuntimeConfig();
      return product.image ? product.image.sourceUrl : config.placeholderImage;
    },
    async addToCart (product) {
      const result = await addProductToCart(product);
      if(result !== false) {
        errMsg = result.message
      }
    },
    convertToTwoDimensionalArray(arr, columns) {
      const result = [];
      const rows = Math.ceil(arr.length / columns);

      for (let i = 0; i < rows; i++) {
        result.push(arr.slice(i * columns, (i + 1) * columns));
      }

      return result;
    },
    productsGroupLength() {
      let _productsGroupLength = 0
      debugger
      const slideGroupWrapper = this.$refs.section;
      const visibleWidth = slideGroupWrapper.getBoundingClientRect().width;
      let totalWidth = 0

      while(totalWidth < visibleWidth) {
        _productsGroupLength++;
        totalWidth += this.cardWidth
      }

      return _productsGroupLength;
    }
  }
}
</script>
  
<style scoped>
    a:hover {
        border: none;
    }
    .btn-bg-color {
      background-color: rgb(26, 6, 58);
      color: rgb(250 245 255);
    }
    .card-bg-color {
      /* background: rgb(26, 6, 58) !important; */
      background-color: rgb(76 29 149 / var(--tw-bg-opacity));
    }
    .card-height {
        height: 30rem;
    }
    .card-width {
        max-width: 340px;
    }
    .slide-group-wrapper {
      overflow: hidden;
    }

    .hide-item {
      display: none;
    }
    @media (max-width: 1536px) {
        .card-height {
            height: 25rem;
        }
    }
    @media (max-width: 1280px) {
        .card-width {
            max-width: 240px;
        }
        .card-height {
            height: 20.5rem;
        }
        .v-btn-toggle {
            display: none;
        }
    }
    @media (max-width: 960px) {
        .card-width {
            max-width: 200px;
        }
        .card-height {
            height: 20.5rem;
        }
        .v-btn-toggle {
            display: none;
        }
    }
</style>