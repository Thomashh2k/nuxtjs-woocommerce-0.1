<template>
  <v-card style="background: rgb(50, 17, 102)">
    <v-card-text v-if="cartItems?.length">
        <h1 class="tw-h-10 tw-p-6 tw-text-3xl tw-font-bold tw-text-center tw-text-purple-50">Cart</h1>
        <section class="mt-10">
          <div 
              v-for="content in cartItems"
              key="item.databaseId"
              class="tw-flex tw-flex-row tw-p-1 tw-cursor-pointer tw-decoration-purple-50" 
              >

              <NuxtLink style="width:10%" :to="{
                  path: '/product/' + content.product.slug,
                  query: { id: content.databaseId },
              }">
                  <v-img :src="content.product.image.sourceUrl"></v-img>
              </NuxtLink>
              <NuxtLink id="prodInfo" class="tw-text-purple-50 tw-ml-4 hover:tw-underline" style="width: 86%;" 
                :to="{
                  path: '/product/' + content.product.slug,
                  query: { id: content.databaseId },
              }">
                <div class="tw-flex tw-flex-row">
                  <h6>{{ content.product.name }}</h6>

                </div>
                  <div v-if="content.product.onSale" class="tw-flex tw-justify-center tw-mt-2">
                      <div class="tw-line-through">
                          <span v-if="content.variations" v-html="filteredVariantPrice(content.price, 'right')"></span>
                          <span v-else v-html="content.regularPrice"></span>
                      </div>
                      <div class="">
                          <span v-if="content.variations" v-html="filteredVariantPrice(content.price)"></span>
                          <span v-else v-html="content.salePrice"></span>
                      </div>
                  </div>
                  <div v-else>
                      <p class="tw-mt-2 tw-text-sm" v-html="content.product.price"></p>
                  </div>
              </NuxtLink>
              <div class="tw-flex tw-flex-col">
                <v-icon icon="mdi-close" class="tw-text-purple-50" flat variant="plain" @click="handleRemoveProduct(content)">
                </v-icon>
              </div>
            </div>
        </section>
      </v-card-text>
    <h2
      v-if="!cartItems?.length"
      class="tw-m-4 tw-text-3xl tw-text-center tw-text-purple-50"
    >
      Cart is currently empty
    </h2>
    <CommonButton
      link-to="/checkout"
      v-if="showCheckoutButton && cartItems?.length"
      center-button
      >CHECKOUT</CommonButton
    >
  </v-card>
</template>

<script setup>
import GET_CART_QUERY from "@/apollo/queries/GET_CART_QUERY.gql";
import UPDATE_CART_MUTATION from "@/apollo/mutations/UPDATE_CART_MUTATION.gql";
import { removeProductFromCart } from "@/utils/functions";
import { useCart } from "@/store/useCart";

const isRemoving = useState("isRemoving", () => false);

const cart = useCart();

defineProps({
  showCheckoutButton: { type: Boolean, required: false, default: false },
});
debugger
const cartItems = cart.getCartItems
const handleRemoveProduct = async (product) => {
  const updatedItems = [];

  const { key } = product;

  updatedItems.push({
    key,
    quantity: 0,
  });

  isRemoving.value = true;

  const variables = {
    input: {
      items: updatedItems,
    },
  };
  await removeProductFromCart(product)
  isRemoving.value = false;

  // const { mutate, onDone, onError } = useMutation(UPDATE_CART_MUTATION, {
  //   variables,
  // });

  // mutate(variables);

  // onDone(() => {
  //   isRemoving.value = false;
  //   document.location = "/cart";
  // });

  // onError(() => (isRemoving.value = false));
};
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  align-content: center;
  max-width: 1380px;
  @apply tw-border tw-border-gray-300 tw-rounded-lg tw-shadow;
}

.item {
  @apply lg:tw-m-2 xl:tw-m-4 xl:tw-w-1/6 lg:tw-w-1/6 sm:tw-m-2 tw-w-auto;
}

.item-content {
  @apply tw-inline-block tw-mt-4 tw-w-20 tw-h-12 md:tw-w-full lg:tw-w-full xl:tw-w-full;
}

.removing {
  @apply tw-animate-spin tw-cursor-not-allowed;
}
</style>
