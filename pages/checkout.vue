<template>
  <v-row>
    <v-col md="1"></v-col>
    <v-col cols="12" md="10">
      <v-card class="account-card-bg">
        <v-tabs
          v-model="tab"
          class="tw-bg-violet-900"
          align-tabs="center"
          >
          <!-- :direction="window.screen.width < 600 ? 'vertical' : 'horizontal'" -->
          <v-tab value="cart">
            <div class="tw-text-purple-50 tw-normal-case">Warenkorb</div>
          </v-tab>
          <v-tab value="shipping">
            <div class="tw-text-purple-50 tw-normal-case">Versand</div>
          </v-tab>
          <v-tab value="payment">
            <div class="tw-text-purple-50 tw-normal-case">Bezahlen</div>
          </v-tab>
        </v-tabs>
        <v-card-text style="margin: unset; padding: unset">
          <v-window v-model="tab">
            <v-window-item value="cart">
              <CartContents class="tw-w-full" :address-info="addressInfo" :tab-pos="tab" @reset-tab="tab = $event" style="height: 87%;"/>
            </v-window-item>
            <v-window-item value="shipping">
              <CheckoutForm 
                ref="checkoutForm"
                class="tw-w-full tw-h-full"
                :tab-pos="tab"
                @updated-address-info="updatedAddressInfo"
                @reset-tab="tab = $event"
              />
            </v-window-item>
            <v-window-item value="payment">
              <PaymentForm class="tw-w-full tw-h-full" @checked-out="checkedout"/>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col md="1"></v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
import PaymentForm from '@/components/Checkout/PaymentForm';
import CartContents from '@/components/Checkout/CartContents';
import { checkout } from "@/utils/functions";

let tab = ref('cart')
let addressInfo = null
const checkoutForm = ref(null)

useHead({
  title: "Checkout",
  titleTemplate: "%s - Nuxt 3 Woocommerce",
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      hid: "description",
      name: "description",
      content: "Nuxt 3 Woocommerce",
    },
  ],
  link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
});

const router = useRouter()


onMounted(() => {
  watch(tab, (newVal, oldVal) => {
    
    checkoutForm.value.submitCheckout()
    if(addressInfo === null || checkoutForm.value.hasFormErrors) {
      if(newVal === 'payment') {
        $emit('resetTab', 'shipping')
      }
    }
  }
)
})
const updatedAddressInfo = ($event) => {
  
  addressInfo = $event
}
const checkedout = ($event, tId) => {
  
  checkout(addressInfo, $event, tId, undefined, undefined, router)
}


</script>
