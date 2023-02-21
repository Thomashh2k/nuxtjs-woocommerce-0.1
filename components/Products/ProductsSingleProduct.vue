<template>
  <div v-if="data.product">
    <section>
      <div class="tw-container tw-flex tw-flex-wrap tw-items-center tw-pt-4 tw-pb-12 tw-mx-auto">
        <div
          class="tw-grid tw-grid-cols-1 tw-gap-4 tw-mt-8 lg:tw-grid-cols-2 xl:tw-grid-cols-2 md:tw-grid-cols-2 sm:tw-grid-cols-2"
        >
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
          <div class="tw-ml-8">
            <p class="tw-text-3xl tw-font-bold tw-text-left">
              {{ data.product.name }}
            </p>
            <div v-if="data.product.onSale" class="tw-flex">
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
            <p v-else class="tw-pt-1 tw-mt-4 tw-text-2xl tw-text-purple-50" v-html="data.product.price">
            </p>
            <!-- {{ data.product.price.replace('&nbsp;', ' ') }} -->
            <br />
            <p class="tw-pt-1 tw-mt-4 tw-text-2xl">
              {{ stripHTML(data.product.description) }}
            </p>
            <p
              v-if="data.product.stockQuantity"
              class="tw-pt-1 tw-mt-4 tw-text-2xl tw-text-green-500"
            >
              {{ data.product.stockQuantity }} in stock
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
            <div class="pt-1 mt-2">
              <CommonButton
                @common-button-click="addProductToCart(data.product)"
                :is-loading="isLoading"
              >
                ADD TO CART</CommonButton
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import GET_SINGLE_PRODUCT_QUERY from "@/apollo/queries/GET_SINGLE_PRODUCT_QUERY.gql";
import ADD_TO_CART_MUTATION from "@/apollo/mutations/ADD_TO_CART_MUTATION.gql";

import {
  stripHTML,
  filteredVariantPrice,
  filteredVariantName,
} from "@/utils/functions";

import { useCart } from "@/store/useCart";
debugger

const isLoading = useState("isLoading", () => false);

const config = useRuntimeConfig();

const cart = useCart();

const props = defineProps({
  id: { type: String, required: true },
  slug: { type: String, required: true },
});

const variables = { id: props.id, slug: props.slug };
const { data, onError } = await useAsyncQuery(GET_SINGLE_PRODUCT_QUERY, variables);
console.log(data)
console.log(onError)

const addProductToCart = async (product) => {
  debugger
  const productId = product.databaseId ? product.databaseId : product;
  const productQueryInput = {
    productId,
  };

  isLoading.value = true;

  const addToCartvariables = { input: productQueryInput };

  cart.addToCart(product);

  const { mutate, onDone, onError } = useMutation(ADD_TO_CART_MUTATION, {
    addToCartvariables,
  });

  mutate(addToCartvariables);

  onDone(() => {
    isLoading.value = false;
  });

  onError(() => {
    isLoading.value = false;
  });
};
</script>
