<template>
<v-card
    :key="product.id"
    style="z-index: 0;"
    class="card-bg-color card-height card-width tw-text-black lg:tw-mt-6 md:tw-mt-5 sm:tw-mt-5 max-[1280px]:tw-mt-5 sm:tw-w1/2 md:tw-w-1/3 lg:tw-w-1/4 lg:tw-mr-4 md:tw-mr-3 sm:tw-mr-3 max-[1280px]:tw-mr-2 hover:shadow-2xl card-bg-color"
>
    <!-- :class="{ 'hide-item': isItemVisible(index) }" -->
<!-- tw-bg-violet-900 -->
    <NuxtLink
        v-if="product.slug"
        class="tw-cursor-pointer"
        :to="{
            path: '/product/' + product.slug,
            query: { id: product.databaseId },
        }"
    >
        <img
            id="product-image"
            class="tw-border 2xl:tw-h-72 xl:tw-h-72 lg:tw-h-72 md:tw-h-56 sm:tw-h-48 xs:tw-h-48 xxs:tw-h-48  tw-rounded tw-drop-shadow-lg tw-transition tw-duration-500 tw-ease-in-out tw-transform tw-cursor-pointer lg:tw-ml-0 tw-w-full  tw-hover:tw-scale-95"
            :alt="product.name"
            :src="productImage(product)"
        />
        <div class="tw-flex tw-justify-center tw-pt-3 hover:tw-underline tw-decoration-purple-50">
            <p class="lg:tw-text-lg  tw-font-bold tw-text-center tw-truncate tw-cursor-pointer tw-text-purple-50">
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
        <div v-if="product.onSale" class="tw-flex tw-justify-start tw-m-2 tw-mb-0  lg:tw-text-sm  hover:tw-underline tw-decoration-purple-50  ">
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
            <p class="tw-mx-2 tw-mt-2  tw-text-xl tw-text-center tw-text-purple-50 hover:tw-underline tw-decoration-purple-50  " v-html="product.price"></p>
        </div>
    </NuxtLink>
    <v-card-actions style="z-index: 10;" >
        <div class="tw-w-full xxxs:tw-hidden xxs:tw-hidden xs:tw-hidden md:tw-hidden lg:tw-flex tw-justify-center">
            <v-btn-toggle color="success" variant="outlined" rounded="xl" class="lg:tw-h-4 lg:tw-pt-2">
                <v-btn style="border: 2px solid rgb(76, 175, 80); color: rgb(76, 175, 80); border-right: unset;" :disabled="product.stockStatus === 'OUT_OF_STOCK'" icon="mdi-cart-plus" @click="addToCart(product)" />
                <v-btn style="border: 2px solid rgb(76, 175, 80); color: rgb(76, 175, 80); border-left: unset; margin-inline-start: unset;" :disabled="product.stockStatus === 'OUT_OF_STOCK'" icon="mdi-cash-register" @click="addToCart(product)" />
            </v-btn-toggle>
        </div>
        <div class="xxxs:tw-hidden xxs:tw-hidden xs:tw-hidden tw-w-full md:tw-flex lg:tw-hidden">
            <v-row>
                <v-col>
                    <div class="tw-flex tw-flex-col">
                        <v-btn style="color: rgb(76, 175, 80);" :disabled="product.stockStatus === 'OUT_OF_STOCK'" size="large" icon="mdi-cart-plus" @click="addToCart(product)" />
                    </div>
                </v-col>
                <v-col>
                    <div class="tw-flex tw-flex-col">
                        <div class="tw-flex tw-justify-end">
                            <v-btn style="color: rgb(76, 175, 80);" :disabled="product.stockStatus === 'OUT_OF_STOCK'" size="large" icon="mdi-cash-register" @click="addToCart(product)" />
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="md:tw-hidden tw-w-full tw-flex tw-flex-row">
            <!-- <v-btn style="color: rgb(76, 175, 80);" :disabled="product.stockStatus === 'OUT_OF_STOCK'" size="small" icon="mdi-cart-plus" @click="addToCart(product)" />
            <v-btn style="color: rgb(76, 175, 80);" :disabled="product.stockStatus === 'OUT_OF_STOCK'" size="small" icon="mdi-cash-register" @click="addToCart(product)" /> -->
            <v-row>
                <v-col>
                    <div class="tw-flex tw-flex-col tw-bottom-0">
                        <v-btn style="color: rgb(76, 175, 80);" :disabled="product.stockStatus === 'OUT_OF_STOCK'" size="x-small" icon="mdi-cart-plus" @click="addToCart(product)" />
                    </div>
                </v-col>
                <v-col>
                    <div class="tw-flex tw-flex-col tw-mb-2">
                        <div class="tw-flex tw-justify-end">
                            <v-btn style="color: rgb(76, 175, 80);" :disabled="product.stockStatus === 'OUT_OF_STOCK'" size="x-small" icon="mdi-cash-register" @click="addToCart(product)" />
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>
    </v-card-actions>
</v-card>
</template>
<script>
export default {
    name: 'ProductCard',
    props: {
        product: {
            type: Object,
            required: true,
        },
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
    }
}
}
</script>
<style scoped>
    .btn-bg-color {
      background-color: rgb(26, 6, 58);
      color: rgb(250 245 255);
    }
    .card-bg-color {
      /* background: rgb(26, 6, 58) !important; */
      background-color: rgb(76 29 149 / var(--tw-bg-opacity));
    }
    .card-height {
        height: 28rem;
    }
    .card-width {
        max-width: 340px;
        min-width: 340px;
    }
    @media (max-width: 2160px) {
        .card-height {
            height: 28rem;
        }
        .card-width {
            max-width: 340px;
            min-width: 340px;
        }
    }
    @media screen and (max-width: 1920px) {
        .card-width {
            max-width: 305px;
            min-width: 305px;
        }
        .card-height {
            height: 28rem;
        }
    }

    @media screen and (max-width: 1280px) { 
        .card-width {
            max-width: 240px;
            min-width: 240px;
        }
        .card-height {
            height: 24.5rem;
        }
    }
    @media screen and (max-width: 960px) {
        .card-width {
            max-width: 180px;
            min-width: 180px;
        }
        .card-height {
            height: 20.5rem;
        }
        .v-btn-toggle {
            display: none;
        }
    }
    @media screen and (max-width: 640px) { 
        .card-width {
            max-width: 180px;
            min-width: 180px;
        }
        .card-height {
            height: 20.5rem;
        }
        .v-btn-toggle {
            display: none;
        }
    }
    /* PERCENTAGE */
    /* .card-width {
        max-width: 19%;
        min-width: 19%;
    }
    @media (max-width: 2160px) {
        .card-height {
            height: 28rem;
        }
        .card-width {
            max-width: 19%;
            min-width: 19%;
        }
    }
    @media screen and (max-width: 1920px) {
        .card-width {
            max-width: 19%;
            min-width: 19%;
        }
        .card-height {
            height: 28rem;
        }
    }
    @media screen and (max-width: 1536px) { 
        .card-width {
            max-width: 25%;
            min-width: 25%;
        }
        .card-height {
            height: 24.5rem;
        }
    }
    @media screen and (max-width: 1280px) { 
        .card-width {
            max-width: 25%;
            min-width: 25%;
        }
        .card-height {
            height: 24.5rem;
        }
    }
    @media screen and (max-width: 960px) {
        .card-width {
            max-width: 28%;
            min-width: 28%;
        }
        .card-height {
            height: 20.5rem;
        }
        .v-btn-toggle {
            display: none;
        }
    }
    @media screen and (max-width: 640px) { 
        .card-width {
            max-width: 45%;
            min-width: 45%;
        }
        .card-height {
            height: 20.5rem;
        }
        .v-btn-toggle {
            display: none;
        }
    } */
</style>
