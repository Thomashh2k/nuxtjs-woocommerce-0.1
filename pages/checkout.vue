<template>
  <v-row>
    <v-col cols="12">
      <v-card class="account-card-bg ">
        <v-card-text>
          <div class="max-[960px]:tw-flex tw-hidden">
            <v-row>
              <v-col>
                <CartContents class="tw-w-full " :address-info="addressInfo" :tab-pos="tab" @reset-tab="tab = $event" style="height: 87%;"/> -->
              </v-col>
            </v-row>
          </div>
          <v-row>
            <v-col cols="12" sm="12" md="6" xl="6">
              <CheckoutForm 
                ref="checkoutForm"
              />
              <v-radio-group v-model="paymentMethod" class="tw-text-purple-50" color="#4c1d95">
                <v-radio label="Banküberweisung" value="bacs"></v-radio>
                <v-radio label="Klarna" value="klarna"></v-radio>
                <v-radio label="Paypal" value="ppcp-gateway"></v-radio>
              </v-radio-group>
              <Checkboxes ref="checkboxForm" :order-data="orderData" @checked-out="checkedout"/>
              <div class="tw-w-full tw-flex tw-justify-center">
                <PaypalButton v-if="paymentMethod === 'ppcp-gateway'" :is-valid-to-click="checkoutIsValid" @onPay="submitOrder" @click="createOrderData"/>
                <v-btn v-if="paymentMethod === 'bacs'" color="green" variant="outlined" @click="submitOrder()" >
                  <div class="tw-normal-case">Bestellen</div>
                </v-btn>
              </div>
            </v-col>
            <v-col cols="12" sm="12" md="6" xl="6">
              <CartContents class="tw-w-full max-[960px]:tw-hidden" :address-info="addressInfo" :tab-pos="tab" @reset-tab="tab = $event" style="height: 87%;"/>
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
        
        await checkout(this.orderData.shippingAddress, this.orderData.billingAddress, this.paymentMethod, this.$router)
      }
    },
  }
}

</script>
