<template>
  <div v-if="data.product">
    <section>
      <div class="tw-container tw-flex tw-flex-wrap tw-items-center tw-pt-4 tw-pb-12 tw-mx-auto">
        <v-row>
          <v-col>
            <img
              v-if="data.product.image"
              id="product-image"
              class="tw-h-auto tw-p-8 tw-transition tw-duration-500 tw-ease-in-out tw-transform xl:tw-p-2 md:tw-p-2 lg:tw-p-2 hover:tw-shadow-lg hover:tw-scale-95"
              :alt="data.product.name"
              :src="data.product.image.sourceUrl"
            />
            <img
              v-else
              id="product-image"
              class="tw-h-auto tw-p-8 tw-transition tw-duration-500 tw-ease-in-out tw-transform xl:tw-p-2 md:tw-p-2 lg:tw-p-2 hover:tw-shadow-lg hover:tw-scale-95"
              :alt="data.product.name"
              :src="config.placeholderImage"
            />
          </v-col>
          <v-col cols="12" lg="7">
            <div>
              <p class="tw-text-3xl tw-font-bold tw-text-left xl:tw-text-left tw-text-center">
                {{ data.product.name }}
              </p>
              <div v-if="data.product.onSale" class="tw-flex xl:tw-text-left tw-text-center">
                <p class="tw-pt-1 tw-mt-4 tw-text-3xl tw-text-purple-50">
                  <span v-if="data.productvariations">
                    {{ filteredVariantPrice(data.product.price.replace('&nbsp;', ' ')) }}</span
                  >
                  <span v-else v-html="data.product.salePrice"></span>
                </p>
                <p class="tw-pt-1 tw-pl-8 tw-mt-4 tw-text-2xl tw-text-purple-50 tw-line-through">
                  <span v-if="data.productvariations">
                    {{ filteredVariantPrice(data.product.price, "right") }}</span
                  >
                  <span v-else v-html="data.product.regularPrice"></span>
                </p>
              </div>
              <p v-else class="tw-pt-1 tw-mt-4 tw-text-2xl tw-text-purple-50 xl:tw-text-left tw-text-center" v-html="data.product.price">
              </p>
              <p
                v-if="data.product.stockQuantity"
                class="tw-pt-1 tw-mt-4 tw-text-xl tw-text-green-500 xl:tw-text-left tw-text-center"
              >
                {{ data.product.stockQuantity }} in stock
              </p>
              <div class="pt-1 mt-2 xl:tw-text-left tw-text-center">
                <v-btn-group color="green" variant="outlined" rounded="xl" style="border: unset">
                  <v-btn
                    @click="addProductToCart(data.product)"
                    :loading="isLoading"
                    style="border-right: 1px solid;"
                    class="tw-border-2"
                  >
                  <div class="tw-normal-case tw-text-lg">
                      In den Warenkorb
                    </div>
                  </v-btn>
                    <v-btn
                    @click="addProductToCart(data.product)"
                    class="tw-border-2"

                    :loading="isLoading"
                  >
                  <div class="tw-normal-case tw-text-lg">
                      Sofort Kaufen
                    </div>
                  </v-btn>
                </v-btn-group>
              </div>
              <br />
              <p class="tw-pt-1 tw-mt-4 lg:tw-text-2xl">
                {{ stripHTML(data.product.description) }}
              </p>
              <p
                v-if="data.product.variations"
                class="tw-pt-1 tw-mt-4 tw-text-xl tw-text-purple-50"
              >
                <span class="py-2">Varianter</span>
                <select
                  id="variant"
                  name="variant"
                  class="tw-block tw-w-64 tw-px-6 tw-py-2 tw-bg-white tw-border tw-border-purple-50 tw-rounded-lg focus:tw-outline-none focus:tw-shadow-outline"
                >
                  <option
                    v-for="(variation, index) in data.product.variations.nodes"
                    :key="variation.databaseId"
                    :value="variation.databaseId"
                    :selected="index === 0"
                  >
                    {{ filteredVariantName(data.product.name, variation.name) }}
                    ({{ variation.stockQuantity }} in stock)
                  </option>
                </select>
              </p>

            </div>
          </v-col>
        </v-row>
      </div>
    </section>
  </div>
</template>

<script setup>
import GET_SINGLE_PRODUCT_QUERY from "@/apollo/queries/GET_SINGLE_PRODUCT_QUERY.gql";

import {
  stripHTML,
  filteredVariantPrice,
  filteredVariantName,
  addProductToCart,
} from "@/utils/functions";


const isLoading = useState("isLoading", () => false);

const config = useRuntimeConfig();


const props = defineProps({
  id: { type: String, required: true },
  slug: { type: String, required: true },
});

const variables = { id: props.id, slug: props.slug };
const { data, onError } = await useAsyncQuery(GET_SINGLE_PRODUCT_QUERY, variables);
console.log(data)
console.log(onError)


</script>
