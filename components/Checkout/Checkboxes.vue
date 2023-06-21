<template>
  <div>
    <div class="tw-flex tw-flex-col">
      <div class="tw-p-4 tw-flex tw-flex-col">
        <v-switch
            v-model="agreedToAGB.value.value"
            :error-messages="agreedToAGB.errorMessage.value"
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
  </div>
  </template>
<script>
import { useField, useForm } from 'vee-validate';
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
    formData: {
      type: Object,
      required: true
    }
  },
  setup(context, props) {
    const { handleSubmit } = useForm({
            validationSchema: {
              agreedToAGB(value) {
                    if (!value) return 'Sie müssen den AGBs zustimmen.'
                    return true
              }
            }
    })

    const agreedToAGB = useField('agreedToAGB')
    agreedToAGB.value.value = false
    const submitCheckboxes = handleSubmit(async (values) => {
      return values
    })
    return {
      agreedToAGB,
      submitCheckboxes
    }
  },
  emits: ['checkedOut'],
  data() {
      return {
        paymentMethod: 'bacs',
        agreedToCookies : false,
        agreedToNewsletter : false,
        testPaypalResult: null,
      }
  }
}
</script>