<template>
    <v-row>
      <v-col lg="1"></v-col>
      <v-col cols="12" lg="10">
        <v-card class="account-card-bg ">
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
                  <v-radio label="Banküberweisung" value="bacs"></v-radio>
                  <v-radio label="Klarna" value="klarna"></v-radio>
                  <v-radio label="Paypal" value="ppcp-gateway"></v-radio>
                </v-radio-group>
                <Checkboxes ref="checkboxForm" :order-data="orderData" />
                <div class="tw-w-full tw-flex tw-justify-center">
                  <PaypalButton v-if="paymentMethod === 'ppcp-gateway'" :is-valid-to-click="checkoutIsValid" @onPay="submitOrder" @click="createOrderData"/>
                  <v-btn v-if="paymentMethod === 'bacs'" color="green" variant="outlined" @click="submitOrder()" >
                    <div class="tw-normal-case">Bestellen</div>
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
    </v-row>
</template>

<script>
import { ref, reactive } from 'vue';
import PaypalButton from '@/components/Checkout/Payments/PaypalButton.vue'
import Checkboxes from '@/components/Checkout/Checkboxes';
import CartContents from '@/components/Checkout/CartContents';
import SelectedProduct from '@/components/OneClickCheckout/SelectedProduct';
import { oneClickCheckout } from "@/utils/functions";
import { useAuth } from '@/store/useAuth.js'
import GET_SINGLE_PRODUCT_QUERY from "@/apollo/queries/GET_SINGLE_PRODUCT_QUERY.gql";

export default {
    name: 'one-click-checkout',
    components: {
        Checkboxes,
        SelectedProduct,
        PaypalButton,
        CartContents
    },
    data() {
      return {
        paymentMethod: 'bacs',
        addressInfo: null,
        orderData: null,
        aggreed: null,
        product: {
          image: {
            sourceUrl: ''
          },
        },
        authStore: useAuth(),
      }
    },
    async created() {
      this.getProduct()
    },
    methods: {
      async createOrderData() {
        debugger
        this.orderData = await this.$refs.checkoutForm.submitForm()
        
        this.aggreed = await this.$refs.checkboxForm.submitCheckboxes()

      },
      getProduct() {
        debugger
        const variables = { id: this.$route.query.id, slug: this.$route.query.slug };
        const result = useQuery(GET_SINGLE_PRODUCT_QUERY, variables);
        result.onResult((res) => {
          debugger
          const data = res?.data;
          this.product = data.product;
        });
      },
      async submitOrder() {
        debugger
        await this.createOrderData()
        if(this.aggreed) {
          
          await oneClickCheckout(this.$route.query.id, this.orderData.shippingAddress, this.orderData.billingAddress, this.paymentMethod)
        }
      }
    }
}
</script>