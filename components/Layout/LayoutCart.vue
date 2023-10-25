<template>
  <div>
    <div v-if="remoteError">
      <span class="tw-text-xl tw-text-red-500"
        >Error fetching cart. Please refresh the page.</span
      >
    </div>
    <div v-else class="tw-mt-4 lg:tw-mt-0">
      <NuxtLink to="/cart">
        <transition name="cart">
          <span
            v-if="cartLength"
            class="tw-text-xl tw-text-white tw-no-underline lg:tw-text-black tw-is-active"
          >
            <span class="hidden lg:block">
              <img
                alt="Cart icon"
                class="tw-h-12 tw-ml-4 lg:tw-ml-2"
                aria-label="Cart"
                src="~/assets/svg/Cart.svg"
              />
            </span>
            <span class="tw-block lg:tw-hidden">
              <Icon
                name="ri:shopping-cart-2-line"
                size="3em"
                class="tw-text-white lg:tw-text-black"
              />
            </span>
          </span>
        </transition>
        <transition name="cart">
          <div v-if="cartLength">
            <span
              class="tw-absolute tw-w-6 tw-h-6 tw-pb-2 tw-ml-16 tw-mt-12 tw-text-center tw-text-black tw-bg-white lg:tw-text-white lg:tw-bg-black tw-rounded-full lg:tw-ml-14"
            >
              {{ cartLength }}
            </span>
            <span class="tw-text-white lg:tw-text-black"
              >Total: {{ config.currencySymbol }} {{ subTotal }}</span
            >
          </div>
        </transition>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import GET_CART_QUERY from "@/apollo/queries/GET_CART_QUERY.gql";

import { getCookie } from "@/utils/functions";

import { useCart } from "@/store/useCart";

const cartLength = useState("cartLength", () => 0);
const subTotal = useState("subTotal", "");
const remoteError = useState("remoteError", () => false);

const config = useRuntimeConfig();

const cart = useCart();

const { data, error, pending, execute } = await useAsyncQuery(GET_CART_QUERY, {
  options: { fetchPolicy: "cache-and-network" },
});

if(error !== null) {
  console.error(error)
}

const updateCartDisplay = () => {
  if (!data) {
    return;
  }
  
  cartLength.value = cart.getCartQuantity;

  subTotal.value = cart.getCartTotal;

  remoteError.value = error;
};

onBeforeMount(() => {
  execute();
  updateCartDisplay();
});

setInterval(() => {
  if (process.client && !pending.value && getCookie("woo-session")) {
    updateCartDisplay();
  }
}, 1000);
</script>
