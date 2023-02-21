<template>
  <div>
    <div v-if="data.cart?.contents?.nodes?.length">
      <h1 class="tw-h-10 tw-p-6 tw-text-3xl tw-font-bold tw-text-center">Cart</h1>
      <section class="mt-10">
        <div
          v-for="products in data.cart.contents.nodes"
          :key="products.id"
          class="tw-container tw-mx-auto tw-mt-4 tw-flex-container"
        >
          <div class="item">
            <span class="tw-block tw-mt-2 tw-font-extrabold">Remove: <br /></span>
            <span class="item-content">
              <img
                class="tw-mt-2 tw-ml-4 tw-cursor-pointer"
                :class="{ removing: isRemoving }"
                alt="Remove icon"
                aria-label="Remove"
                src="@/assets/svg/Remove.svg"
                @click="handleRemoveProduct(products)"
              />
            </span>
          </div>

          <div class="item">
            <span class="tw-block tw-mt-2 tw-font-extrabold">Name: <br /></span>
            <span class="item-content">{{ products.product.name }}</span>
          </div>
          <div class="item">
            <span class="tw-block tw-mt-2 tw-font-extrabold">Quantity: <br /> </span>
            <span class="item-content">
              {{ products.quantity }}
            </span>
          </div>
          <div class="item">
            <span class="tw-block tw-mt-2 tw-font-extrabold">Subtotal: <br /></span>
            <span class="item-content"> {{ products.total }} </span>
          </div>
        </div>
      </section>
    </div>
    <h2
      v-if="!data.cart?.contents?.nodes?.length"
      class="tw-m-4 tw-text-3xl tw-text-center"
    >
      Cart is currently empty
    </h2>
    <CommonButton
      link-to="/checkout"
      v-if="showCheckoutButton && data.cart?.contents?.nodes?.length"
      center-button
      >CHECKOUT</CommonButton
    >
  </div>
</template>

<script setup>
import GET_CART_QUERY from "@/apollo/queries/GET_CART_QUERY.gql";
import UPDATE_CART_MUTATION from "@/apollo/mutations/UPDATE_CART_MUTATION.gql";

import { useCart } from "@/store/useCart";

const isRemoving = useState("isRemoving", () => false);

const cart = useCart();

defineProps({
  showCheckoutButton: { type: Boolean, required: false, default: false },
});

const { data } = await useAsyncQuery(GET_CART_QUERY);

const handleRemoveProduct = (product) => {
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

  cart.removeProductFromCart(product);

  const { mutate, onDone, onError } = useMutation(UPDATE_CART_MUTATION, {
    variables,
  });

  mutate(variables);

  onDone(() => {
    isRemoving.value = false;
    document.location = "/cart";
  });

  onError(() => (isRemoving.value = false));
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
