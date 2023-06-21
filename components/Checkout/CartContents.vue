<template>
  <div>
    <!-- <v-card style="background: rgb(50, 17, 102)"> -->
      <!-- <v-card-text v-if="cartItems?.length"> -->
      <h1 class="tw-h-10 tw-p-6 tw-text-3xl tw-font-bold tw-text-center tw-text-purple-50">Warenkorb</h1>
      <section class="tw-mt-10 tw-overflow-y-auto" style="height: 15%;">
        <div 
            v-for="product in cartItems"
            key="item.databaseId"
            class="tw-flex tw-flex-row tw-p-1 tw-cursor-pointer tw-decoration-purple-50" 
            >

            <NuxtLink style="width:10%" :to="{
                path: '/product/' + product.slug,
                query: { id: databaseId },
            }">
                <v-img :src="product.image.sourceUrl"></v-img>
            </NuxtLink>
            <NuxtLink id="prodInfo" class="tw-text-purple-50 tw-ml-4 hover:tw-underline" style="width: 86%;" 
              :to="{
                path: '/product/' + product.slug,
                query: { id: product.databaseId },
            }">
              <div class="tw-flex tw-flex-row">
                <h6>{{ product.name }}</h6>

              </div>
                <div v-if="product.onSale" class="tw-flex tw-justify-center tw-mt-2">
                    <div class="tw-line-through">
                        <span v-if="product.variations" v-html="filteredVariantPrice(product.price, 'right')"></span>
                        <span v-else v-html="product.regularPrice"></span>
                    </div>
                    <div class="">
                        <span v-if="product.variations" v-html="filteredVariantPrice(product.price)"></span>
                        <span v-else v-html="product.salePrice"></span>
                    </div>
                </div>
                <div v-else>
                    <p class="tw-mt-2 tw-text-sm" v-html="product.price"></p>
                </div>
            </NuxtLink>
            <div class="tw-flex tw-flex-col">
              <v-icon icon="mdi-close" class="tw-text-purple-50" flat variant="plain" @click="handleRemoveProduct(product)">
              </v-icon>
            </div>
        </div>
      </section>
      <div class="tw-grid tw-grid-cols-3 tw-text-purple-50">
        <div class="t">
          <p class="tw-text-xl tw-p-2">Warenwert: </p>
          <v-divider/>
          <p class="tw-text-xl tw-p-2">Versandkosten: </p>
          <v-divider/>
          <p class="tw-text-xl tw-p-2">Insgesammt: </p>
        </div>
        <div class="tw-col-span-2">
          <p class="tw-text-xl tw-p-2">{{ productTotal }}</p>
          <v-divider/>
          <p class="tw-text-xl tw-p-2">{{ numberToPrice(shippingTotal) }}</p>
          <v-divider/>
          <p class="tw-text-2xl tw-p-2">{{ numberToPrice(total) }}</p>
        </div>
      </div>

        <!-- </v-card-text> -->
      <h2
        v-if="!cartItems?.length"
        class="tw-m-4 tw-text-3xl tw-text-center tw-text-purple-50"
      >
        Ihr Warenkorb ist momentan leer.
      </h2>
    <!-- </v-card> -->
  </div>
</template>
<script setup>

import GET_CART_QUERY from "@/apollo/queries/GET_CART_QUERY.gql";
import UPDATE_CART_MUTATION from "@/apollo/mutations/UPDATE_CART_MUTATION.gql";
import { removeProductFromCart, priceToNumber, numberToPrice } from "@/utils/functions";
import { useCart } from "@/store/useCart";

const isRemoving = useState("isRemoving", () => false);

const cart = useCart();
const props = defineProps(['tabPos', 'addressInfo'])
// watch(tabPos, (newVal, oldVal) => {
//       
//       if(this.addressInfo === null) {
//         if(newVal === 'payment') {
//           this.$emit('resetTab', 'shipping')
//         }
//       }
//     }
// )
    
let total = priceToNumber(cart.getCartDetails.total)
let shippingTotal = priceToNumber(cart.getCartDetails.shippingTotal)
let productTotal = numberToPrice(total - shippingTotal)

// defineProps({
//   showCheckoutButton: { type: Boolean, required: false, default: false },
// });

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

  // onError((err) => (isRemoving.value = false));
};
</script>