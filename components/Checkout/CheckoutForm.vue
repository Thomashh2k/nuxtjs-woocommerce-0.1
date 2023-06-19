<template>
  <section class="tw-container tw-p-4 tw-py-2 tw-mx-auto">
        <v-form @submit="submit">
          <div class="tw-mx-auto">
            <AddressForm ref="addressForm" :address-info="customer.shipping" :show-save-btn="false" :show-cols="false"/>
            <div v-if="!authStore.isLoggedIn">
              <v-text-field
                v-model="email.value.value"
                label="E-Mail"
                class="tw-m-2"
                :error-messages="email.errorMessage.value"
                variant="solo"
                density="compact"
                bg-color="rgb(26, 6, 58)"
                color="rgb(250, 245, 255)"
              />
              <v-text-field
                v-model="emailRepeat.value.value"
                label="E-Mail wiederholen"
                class="tw-m-2"
                :error-messages="emailRepeat.errorMessage.value"
                variant="solo"
                density="compact"
                bg-color="rgb(26, 6, 58)"
                color="rgb(250, 245, 255)"
              />
              <v-text-field
                v-model="phone.value.value" 
                label="Telefon"
                class="tw-m-2"
                :error-messages="phone.errorMessage.value"
                variant="solo"
                density="compact"
                bg-color="rgb(26, 6, 58)"
                color="rgb(250, 245, 255)"
              />
            </div>
          </div>
        </v-form>
  </section>
</template>

<script>
import { useField, useForm } from "vee-validate";
import { useAuth } from '@/store/useAuth.js'
import { uid } from "uid";

import CHECKOUT_MUTATION from "@/apollo/mutations/CHECKOUT_MUTATION.gql";
import AddressForm from "../Account/forms/AddressForm.vue";
import { validationScheme } from '@/components/Checkout/validation';
import { computed } from 'vue'
export default {
  data() {
    return {
      countryItems: [
        {title: 'Deutschland', value: 'DE'},
        {title: 'Österreich', value: 'AT'},
        {title: 'Schweiz', value: 'CH'}
      ]
    }
  },
  components: {
    AddressForm,
  },
  emits: ['updatedAddressInfo', 'resetTab', 'onDataFilledOut'],
  props: {
    tabPos: {
      type: String,
      required: true
    }
  },
  watch: {
    // async tabPos(newVal, oldVal) { 
    //   debugger
    //   const formValues = await this.submitForm()
    //   if(this.authStore.isLoggedIn) {
    //     if(formValues.addressValues === undefined) {
    //       if(newVal === 'payment') {
    //         this.$emit('resetTab', 'shipping')
    //       }
    //     }
    //   } else {
    //     if(formValues.addressValues === undefined || formValues.notLoggedInVal === undefined) {
    //       if(newVal === 'payment') {
    //         this.$emit('resetTab', 'shipping')
    //       }
    //     }
    //   }
    // }
  },
  setup(props, context) {
    const { handleSubmit, handleReset } = useForm({
      validationSchema: {
        email (value) {
          if (!value) return 'E-Mail ist ein Pflichtfeld'
          if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return 'Es muss eine gültige E-Mail eingegeben werden.'
          if(emailRepeat.value.value !== value) return 'E-Mail Addressen stimmen nicht überein.'

          return true
        },
        emailRepeat (value) {
          if (!value) return 'E-Mail wiederholen ist ein Pflichtfeld.'
          if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return 'Es muss eine gültige E-Mail eingegeben werden.'
          if(email.value.value !== value) return 'E-Mail Addressen stimmen nicht überein.'

          return true
        },
        phone (value) {
            if(value === undefined) value = ""
            if (value.length > 35) return 'Telefonnummer darf nicht länger als 15 Zeichen sein.'
            if (value.length < 5) return 'Telefonnummer darf nicht kleiner als 10 Zeichen sein.'

            return true
        },
      }
    });

    const authStore = useAuth()
    const email = useField('email')
    const emailRepeat = useField('emailRepeat')
    const phone = useField('phone')
    const customer = authStore.getCustomer;

    const submit = handleSubmit(values => {
      context.emit('updatedAddressInfo', values)
      return values
    })


    return { email, emailRepeat, phone, submit, authStore, customer }
  },
  methods: {
    async submitForm() {
      debugger
      if(this.authStore.isLoggedIn) {
        const addressValues = await this.$refs.addressForm.submit()
        this.$emit('onDataFilledOut', addressValues)
        return { addressValues }

      } else {
        const addressValues = await this.$refs.addressForm.submit()
        const notLoggedInVal = await this.submit()
        this.$emit('onDataFilledOut', {addressValues, notLoggedInVal})
        return {addressValues, notLoggedInVal}
      }
    }
  }
}
</script>
