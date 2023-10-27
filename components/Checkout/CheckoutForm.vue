<template>
  <section class="tw-container tw-py-2 tw-mx-auto">
    <v-form @submit="submit">
      <div>
        <div v-if="!authStore.isUserLoggedIn">
          <v-text-field
            v-model="email.value.value"
            label="E-Mail"
            class="tw-mb-2"
            :error-messages="email.errorMessage.value"
            variant="solo"
            density="compact"
            bg-color="rgb(26, 6, 58)"
            color="rgb(250, 245, 255)"
          />
          <v-text-field
            v-model="emailRepeat.value.value"
            label="E-Mail wiederholen"
            :error-messages="emailRepeat.errorMessage.value"
            class="tw-mb-2"
            variant="solo"
            density="compact"
            bg-color="rgb(26, 6, 58)"
            color="rgb(250, 245, 255)"
          />
          <v-text-field
            v-model="phone.value.value" 
            label="Telefon"
            :error-messages="phone.errorMessage.value"
            class="tw-mb-2"
            variant="solo"
            density="compact"
            bg-color="rgb(26, 6, 58)"
            color="rgb(250, 245, 255)"
          />
        </div>
        <AddressForm ref="shippingForm" class="tw-mx-auto" :address-info="customer.shipping" :show-save-btn="false" :show-cols="false"/>
        <div class="tw-flex tw-justify-items-center">
          <v-switch v-model="useDifferentBillingAddress"  class="tw-pl-2">
            <template v-slot:label>
              <span class="tw-text-purple-50">Abweichende Rechnungsadresse verwenden</span>
            </template>
          </v-switch>
        </div>
        <AddressForm v-if="useDifferentBillingAddress" ref="billingForm" :address-info="customer.billing" :show-save-btn="false" :show-cols="false"/>
      </div>
    </v-form>
  </section>
</template>

<script>
import { useField, useForm } from "vee-validate";
import { useAuth } from '@/store/useAuth.js'
import { storeToRefs } from 'pinia'
import AddressForm from "../Account/forms/AddressForm.vue";
export default {
  name: 'CheckoutForm',
  data() {
    return {
      useDifferentBillingAddress: false,
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
    const { getCustomer } = storeToRefs(authStore);
    const customer = getCustomer

    const submit = handleSubmit(values => {
      
      values.email = email.value.value
      return values
    })


    return { email, emailRepeat, phone, submit, authStore, customer }
  },
  watch: {
    getCustomer(newV) {
      this.customer = newV
    }
  },
  methods: {
    async submitForm() {
      
      let billingAddress
      if(this.authStore.isUserLoggedIn) {
        const shippingAddress = await this.$refs.shippingForm.submit()
        if(this.useDifferentBillingAddress) {
          billingAddress = await this.$refs.shippingForm.submit()
        } else {
          billingAddress = shippingAddress
        }
        shippingAddress.email = this.authStore.getUser.email
        billingAddress.email = this.authStore.getUser.email
        return { shippingAddress, billingAddress }

      } else {
        const shippingAddress = await this.$refs.shippingForm.submit()
        if(this.useDifferentBillingAddress) {
          billingAddress = await this.$refs.shippingForm.submit()
        } else {
          billingAddress = shippingAddress
        }
        const notLoggedInVal = await this.submit()
        shippingAddress.email = notLoggedInVal.email
        billingAddress.email = notLoggedInVal.email
        return {shippingAddress, billingAddress, notLoggedInVal}
      }
    }
  }
}
</script>
