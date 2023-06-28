<template>
  <div>
    <!-- <v-card style="background: rgb(50, 17, 102)"> -->
      <!-- <v-card-text v-if="cartItems?.length"> -->
      <h1 class="tw-h-10 tw-p-6 tw-text-3xl tw-font-bold tw-text-center tw-text-purple-50">Warenkorb</h1>
      <section class="tw-mt-10 tw-overflow-y-auto" style="height: 15%;">
        <div 
            v-for="item in cartItems"
            key="item.databaseId"
            class="tw-flex tw-flex-row tw-p-1 tw-cursor-pointer tw-decoration-purple-50" 
            >

            <NuxtLink style="width:10%" :to="{
                path: '/product/' + item.product.slug,
                query: { id: databaseId },
            }">
                <v-img :src="item.product.image.sourceUrl"></v-img>
            </NuxtLink>
            <NuxtLink id="prodInfo" class="tw-text-purple-50 tw-ml-4 hover:tw-underline" style="width: 86%;" 
              :to="{
                path: '/product/' + item.product.slug,
                query: { id: item.product.databaseId },
            }">
              <div class="tw-flex tw-flex-row">
                <h6>{{ item.product.name }}</h6>

              </div>
                <div v-if="item.product.onSale" class="tw-flex tw-justify-center tw-mt-2">
                    <div class="tw-line-through">
                        <span v-if="item.product.variations" v-html="filteredVariantPrice(item.product.price, 'right')"></span>
                        <span v-else v-html="item.product.regularPrice"></span>
                    </div>
                    <div class="">
                        <span v-if="item.product.variations" v-html="filteredVariantPrice(item.product.price)"></span>
                        <span v-else v-html="item.product.salePrice"></span>
                    </div>
                </div>
                <div v-else>
                    <p class="tw-mt-2 tw-text-sm" v-html="item.product.price"></p>
                </div>
            </NuxtLink>
            <div class="tw-flex tw-flex-col">
              <v-icon icon="mdi-close" class="tw-text-purple-50" flat variant="plain" @click="handleRemoveProduct(item)">
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
// CartContents.vue
import GET_CART_QUERY from "@/apollo/queries/GET_CART_QUERY.gql";
import UPDATE_CART_MUTATION from "@/apollo/mutations/UPDATE_CART_MUTATION.gql";
import { removeProductFromCart, priceToNumber, numberToPrice } from "@/utils/functions";
import { useCart } from "@/store/useCart";

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
    
let total = priceToNumber(cart.getDetails.total)
let shippingTotal = priceToNumber(cart.getDetails.shippingTotal)
let productTotal = numberToPrice(total - shippingTotal)

// defineProps({
//   showCheckoutButton: { type: Boolean, required: false, default: false },
// });

const cartItems = cart.getItems
const handleRemoveProduct = async (product) => {
  await removeProductFromCart(product)
};
</script>