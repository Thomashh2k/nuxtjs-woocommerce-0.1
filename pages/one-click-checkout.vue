<template>
  <v-row>
    <v-col lg="1"></v-col>
    <v-col cols="12" lg="10">
      <v-card class="account-card-bg">
        <v-card-text>
          <div class="max-[960px]:tw-flex tw-hidden">
            <v-row>
              <v-col>
                <SelectedProduct class="tw-w-full" :product="product" />
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
              </v-radio-group>
              <div v-show="paymentMethod === 'stripe'" ref="stripeEL" id="stripeEL" class="tw-w-full">
                  <!-- Express Checkout Element will be inserted here -->
              </div>
              <div id="error-message">
                <!-- Display error message to your customers here -->
              </div>
              <Checkboxes ref="checkboxForm" :order-data="orderData" />
              <div class="tw-w-full tw-flex tw-justify-center">
                <PaypalButton v-if="paymentMethod === 'ppcp-gateway'" :is-valid-to-click="checkoutIsValid" @onPay="submitOrder" @click="createOrderData"/>
                <v-btn v-else color="green" variant="outlined" @click="submitOrder()" >
                  <div class="tw-normal-case">Bezahlen</div>
                </v-btn>

              </div>
            </v-col>
            <v-col cols="12" sm="12" md="6" xl="6">
              <SelectedProduct class="tw-w-full max-[960px]:tw-hidden" :product="product" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col lg="1"></v-col>
    <!-- <AgeVerificationDialog v-model="ageVerficationNeeded" /> -->
  </v-row>
</template>

<script>
import { ref, reactive } from 'vue';
import PaypalButton from '@/components/Checkout/Payments/PaypalButton.vue'
import Checkboxes from '@/components/Checkout/Checkboxes';
import CartContents from '@/components/Checkout/CartContents';
import SelectedProduct from '@/components/OneClickCheckout/SelectedProduct';
// import AgeVerificationDialog from '~/components/Checkout/AgeVerificationDialog.vue';
import { oneClickCheckout, priceToNumber } from "@/utils/functions";
import { useAuth } from '@/store/useAuth.js'
import GET_SINGLE_PRODUCT_QUERY from "@/apollo/queries/GET_SINGLE_PRODUCT_QUERY.gql";
import axios from 'axios'
import {loadStripe} from '@stripe/stripe-js';

export default {
    name: 'one-click-checkout',
    components: {
        Checkboxes,
        SelectedProduct,
        // AgeVerificationDialog,
        PaypalButton,
        CartContents
    },
    data() {
      return {
        paymentMethod: 'ppcp-gateway',
        addressInfo: null,
        orderData: null,
        aggreed: null,
        stripe: null,
        stripeElement: null,
        stripeClientSecret: null,
        // ageVerficationNeeded: true,
        product: {
          image: {
            sourceUrl: ''
          },
        },
        authStore: useAuth(),
      }
    },
    async created() {
      
      await this.getProduct()
      console.log(this.product)
      this.stripe = await loadStripe('pk_test_51NTTvgHYY4qFsHLPlf5VaERvj70Le4ERHyXQiZAAoJdpPI9IIN4RfXoUXnfayI6bfXNToQLhRMBc57HqKrRCAsAm00Jb3rtCRF');
      this.stripeClientSecret = await fetch('http://localhost:1337/create-payment-intent?total='+ priceToNumber(this.product.price), {
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
    watch: {
      paymentMethod(newV, oldV) {
        
        if(newV === 'stripe') {
          this.$nextTick(async () => {
            const appearance = {
              theme: 'night',
              type: 'accordion',
              labels: 'floating',
              variables: {
                colorPrimary: '#0570de',
                colorBackground: '#1A063A',
                colorText: '#FAF5FF',
                colorDanger: '#df1b41',
                fontFamily: 'Ideal Sans, system-ui, sans-serif',
                spacingUnit: '2px',
                borderRadius: '4px',
                // See all possible variables below
              }
            };
            this.stripeElement = this.stripe.elements({clientSecret: this.stripeClientSecret, appearance});
            const expressCheckoutElement = this.stripeElement.create('payment', {
              // paymentRequest: paymentRequest
            });
            expressCheckoutElement.mount('#stripeEL');
          })
        } else {
          // this.$refs.stripeEL.style.display = 'block'
        }
      }
    },
    methods: {
      async createOrderData() {
        this.orderData = await this.$refs.checkoutForm.submitForm()
        
        this.aggreed = await this.$refs.checkboxForm.submitCheckboxes()

      },
      async getProduct() {
        
        const variables = { id: this.$route.query.id, slug: this.$route.query.slug };
        const result = await useAsyncQuery(GET_SINGLE_PRODUCT_QUERY, variables);
        await result.execute();
        this.product = result.data.value.product;
      },
      async submitOrder() {
        await this.createOrderData()
        
        if(this.aggreed) {
          
          const { onError, onDone } = await oneClickCheckout(Number(this.$route.query.id), this.orderData.shippingAddress, this.orderData.billingAddress, this.paymentMethod, this.stripe.id)

          onError((err) => {
            const snackbar = useSnackbar()
            snackbar.setMessage(err.message, 'error')
          })
          onDone(async (res) => {
            
            
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

      }
    }
}
</script>