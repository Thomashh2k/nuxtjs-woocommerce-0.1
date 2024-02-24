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
                <v-radio label="bacs" value="bacs"></v-radio>
                <v-radio label="Andere Methoden" value="stripe"></v-radio>
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
                <v-btn v-if="paymentMethod === 'bacs' || paymentMethod === 'stripe'" color="green" variant="outlined" @click="submitOrder()" >
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
import { useOrderReceived } from '@/store/useOrderReceived';

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
      stripePaymentTab: null,
      stripeElement: null,
      stripePaymentIntent: null,
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
  async mounted() {
      const cartStore = useCart()
      const ammount = cartStore.getCartTotal
      this.stripe = await loadStripe('pk_test_51NTTvgHYY4qFsHLPlf5VaERvj70Le4ERHyXQiZAAoJdpPI9IIN4RfXoUXnfayI6bfXNToQLhRMBc57HqKrRCAsAm00Jb3rtCRF');
      const config = useRuntimeConfig();
      this.stripePaymentIntent = await fetch(`${config.public.STRIPE_PAYMENT_API}/create-payment-intent?total=${ammount}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async (res) => {
        const body = await res.json()
        return body
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
            this.stripeElement = this.stripe.elements({clientSecret: this.stripePaymentIntent.clientSecret, appearance});
            const expressCheckoutElement = this.stripeElement.create('payment', {
              // paymentRequest: paymentRequest
            });
            expressCheckoutElement.on('change', (event) => {
              this.stripePaymentTab = event.value.type;
              if (event.error) {
                // Display error message in your UI.
                const displayError = document.getElementById('error-message');
                displayError.textContent = event.error.message;
              }
              console.log(event)
            });
            expressCheckoutElement.mount('#stripeEL');
          })
        } else {
          // this.$refs.stripeEL.style.display = 'block'
        }
      }
    },
  methods: {
    updatedAddressInfo ($event) {
      this.addressInfo = $event
    },
    async createOrderData() {
      this.orderData = await this.$refs.checkoutForm.submitForm()
      debugger
      if(this.paymentMethod.includes('stripe')) {
        this.orderData.transactionId = this.stripePaymentIntent.id
      }
      this.aggreed = await this.$refs.checkboxForm.submitCheckboxes()

    },
    async submitOrder() {
      await this.createOrderData()
      if(this.aggreed) {
        debugger
        this.setStripePaymentMethod()
        const {onError, onDone } = await checkout(this.orderData, this.paymentMethod)
        
        onError((err) => {
            const snackbar = useSnackbar()
            snackbar.setMessage(err.message, 'error')
        })
        onDone(async (res) => {
          
          debugger
          if(this.paymentMethod.includes('stripe')) {
            const errors = await this.stripeElement.submit()
            const config = useRuntimeConfig();
            
            const {error} = await this.stripe.confirmPayment({
              elements: this.stripeElement,
              clientSecret: this.stripePaymentIntent.clientSecret,
              confirmParams: {
                return_url: config.public.SERVER_DOMAIN + '/order-received',
              },
              // Uncomment below if you only want redirect for redirect-based payments
              // redirect: "if_required",
            });
          }
          
          const orderReceivedStore = useOrderReceived();
          orderReceivedStore.setOrder(res.data.checkout.order)
          navigateTo('/order-received')
        })
      }
    },
    setStripePaymentMethod() {
      if(this.stripePaymentTab === 'sofort') {
        this.paymentMethod = 'stripe_sofort'
      } else if(this.stripePaymentTab === 'giropay') {
        this.paymentMethod = 'stripe_giropay'
      } else if (this.stripePaymentTab === 'card') {
        this.paymentMethod = 'stripe_cc'
      }
    }
    
  }
}

</script>
