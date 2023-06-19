<template>
  <div class="tw-flex tw-flex-col">
    <v-radio-group v-model="paymentMethod" class="tw-text-purple-50" color="#4c1d95">
      <v-radio label="Banküberweisung" value="bacs"></v-radio>
      <v-radio label="Klarna" value="klarna"></v-radio>
      <v-radio label="Paypal" value="ppcp-gateway"></v-radio>
    </v-radio-group>
    <div class="tw-p-4 tw-flex tw-flex-col">
      <v-switch
          v-model="agreedToAGB"
          inset
          class="tw-text-purple-50"
          color="primary"
          label="Ich stimme der AGB zu."
      ></v-switch>
      <v-switch
        v-model="agreedToCookies"
        inset
        color="primary"
        class="tw-text-purple-50"
        label="Ich bin einvertsanden von der nutztung funktionaler Cookies."
      ></v-switch>
      <v-switch
        v-model="agreedToNewsletter"
        inset
        class="tw-text-purple-50"
        color="primary"
        label="Ich bin einverstanden das ich von meiner angegbenen E-Mail Werbung zu erhalten"
      ></v-switch>
    </div>
  </div>
  <div class="tw-w-full tw-flex tw-justify-center">
        <PaypalButton v-if="paymentMethod === 'ppcp-gateway'" @onPay="handlePaypalCheckout" />
        <v-btn v-if="paymentMethod === 'bacs'" color="green" variant="outlined" @click="handleCheckout()" >
          <div class="tw-normal-case">Bestellen</div>
        </v-btn>
  </div>
</template>
<script>
import PaypalButton from '@/components/Checkout/Payments/PaypalButton.vue'

export default {
  components: {
    PaypalButton
  },
  props: {
    totalPrice: {
      type: String,
      required: true
    },
    orderData: {
      type: Object,
      required: true
    }
  },
  emits: ['checkedOut'],
  data() {
      return {
        paymentMethod: 'bacs',
        agreedToAGB : false,
        agreedToCookies : false,
        agreedToNewsletter : false,
        testPaypalResult: null,
      }
  },
  methods: {
    handlePaypalCheckout($event) {
      this.testPaypalResult = $event
      
      this.handleCheckout($event.data.orderID)
    },
    handleCheckout(tId) {
      
      if(!this.agreedToAGB || !this.agreedToCookies || !this.agreedToNewsletter) {
        return false
      }
      checkout(addressInfo, this.paymentMethod, tId, undefined, undefined, this.$router)

    }
  }
}
</script>