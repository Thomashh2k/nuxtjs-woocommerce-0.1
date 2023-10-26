<template>
  <v-row>
    <v-col cols="12">
      <v-card class="account-card-bg ">
        <v-card-text>
          <div class="max-[960px]:tw-flex tw-hidden">
            <v-row>
              <v-col>
                <CartContents class="tw-w-full tw-h-16" scroll-height="30%" :address-info="addressInfo" :tab-pos="tab" @reset-tab="tab = $event" style="height: 87%;"/>
              </v-col>
            </v-row>
          </div>
          <v-row>
            <v-col cols="12" sm="12" md="6" xl="6">
              <CheckoutForm 
                ref="checkoutForm"
              />
              <v-radio-group v-model="paymentMethod" class="tw-text-purple-50" color="#4c1d95">
                <v-radio label="Paypal" value="ppcp-gateway"></v-radio>
                <v-radio label="Sonstige Methoden (...)" :disabled="stripeClientSecret === null" value="stripe"></v-radio>
                <v-radio label="Test Methoden" :disabled="stripeClientSecret === null" value="bacs"></v-radio>
              </v-radio-group>
              <div v-show="paymentMethod === 'stripe'" ref="stripeEL" id="stripeEL" class="tw-w-full">
                  <!-- Express Checkout Element will be inserted here -->
              </div>
              <div id="error-message">
                <!-- Display error message to your customers here -->
              </div>
              <Checkboxes ref="checkboxForm" :order-data="orderData"/>
              <div class="tw-w-full tw-flex tw-justify-center">
                <PaypalButton v-if="paymentMethod === 'ppcp-gateway'" :is-valid-to-click="checkoutIsValid" @onPay="submitOrder" @click="createOrderData"/>
                <v-btn v-if="paymentMethod === 'bacs'" color="green" variant="outlined" @click="submitOrder()" >
                  <div class="tw-normal-case">Bezahlen</div>
                </v-btn>
              </div>
            </v-col>
            <v-col cols="12" sm="12" md="6" xl="6">
              <CartContents class="tw-w-full max-[960px]:tw-hidden" scroll-height="40%" :address-info="addressInfo" :tab-pos="tab" @reset-tab="tab = $event" style="height: 87%;"/>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ref, reactive } from 'vue';
import PaypalButton from '@/components/Checkout/Payments/PaypalButton.vue'
import Checkboxes from '@/components/Checkout/Checkboxes';
import CartContents from '@/components/Checkout/CartContents';
import { checkout } from "@/utils/functions";
import { useAuth } from '@/store/useAuth.js'
import { useCart } from '@/store/useCart';
import { loadStripe } from '@stripe/stripe-js';
import { useSnackbar } from '@/store/snackbar';
import { useOrderReceived } from '@/store/useOrderReceivedStore';

const checkoutForm = ref(null)
export default {
  name: 'checkout',
  components: {
    Checkboxes,
    PaypalButton,
    CartContents
  },
  setup() {
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
  },
  data() {
    return {
      paymentMethod: 'bacs',
      addressInfo: null,
      orderData: null,
      aggreed: null,
      stripe: null,
      stripeElement: null,
      stripeClientSecret: null,
      authStore: useAuth(),
    }
  },
  computed: {
    checkoutIsValid() {
      if((this.orderData !== null && this.orderData !== undefined) && (this.aggreed !== null && this.aggreed !== undefined)) {
        return true
      } else {
        return false
      }
    }
  },
  async created() {
      
      const cartStore = useCart()
      const ammount = cartStore.getCartTotal
      this.stripe = await loadStripe('pk_test_51NTTvgHYY4qFsHLPlf5VaERvj70Le4ERHyXQiZAAoJdpPI9IIN4RfXoUXnfayI6bfXNToQLhRMBc57HqKrRCAsAm00Jb3rtCRF');
      this.stripeClientSecret = await fetch('http://localhost:1337/create-payment-intent?total='+ ammount, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async (res) => {
        const body = await res.json()
        return body.clientSecret
      }).catch((err) => {
        console.error(err)
      })
    },
  methods: {
    updatedAddressInfo ($event) {
      this.addressInfo = $event
    },
    async createOrderData() {
      this.orderData = await this.$refs.checkoutForm.submitForm()
      
      this.aggreed = await this.$refs.checkboxForm.submitCheckboxes()

    },
    async submitOrder() {
      await this.createOrderData()
      if(this.aggreed) {
        
       const {onError, onDone } = await checkout(this.orderData.shippingAddress, this.orderData.billingAddress, this.paymentMethod)
        
        onError((err) => {
            const snackbar = useSnackbar()
            snackbar.setMessage(err.message, 'error')
        })
        onDone(async (res) => {
          
          debugger
          if(this.paymentMethod === 'stripe') {
            const errors = await this.stripeElement.submit()
            
            const {error} = await this.stripe.confirmPayment({
              elements: this.stripeElement,
              clientSecret: this.stripeClientSecret,
              confirmParams: {
                return_url: 'http://localhost:3000/order-received',
              },
              // Uncomment below if you only want redirect for redirect-based payments
              // redirect: "if_required",
            });
          }
          
          const orderReceivedStore = useOrderReceived();
          orderReceivedStore.setOrder(res.data.oneClickCheckout.order)
          navigateTo('/order-received')
        })
      }
    },
  }
}

</script>
