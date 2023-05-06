<template>
  <section class="tw-container tw-p-4 tw-py-2 tw-mx-auto">
        <v-form @submit="submitCheckout">
          <div class="tw-mx-auto">
            <div class="tw-flex tw-flex-row">
              <v-text-field 
                v-model="firstName.value.value"
                variant="solo"
                density="compact"
                :error-messages="firstName.errorMessage.value"
                label="Vorname"
                class="tw-m-2"
                bg-color="rgb(26, 6, 58)"
                color="rgb(250, 245, 255)"
            />
            <v-text-field
                v-model="lastName.value.value"
                density="compact"
                label="Nachname"
                class="tw-m-2"
                :error-messages="lastName.errorMessage.value"
                bg-color="rgb(26, 6, 58)"
                color="rgb(250, 245, 255)"
                variant="solo"
            />
            </div>
            <v-text-field
              v-model="address.value.value"
              :error-messages="address.errorMessage.value"
              label="Addresse"
              variant="solo"
              class="tw-m-2"
              density="compact"
              bg-color="rgb(26, 6, 58)"
              color="rgb(250, 245, 255)"
            />
            <div class="tw-flex tw-flex-row">
              <v-text-field
                v-model="zipCode.value.value"
                label="Postleitzahl"
                :error-messages="zipCode.errorMessage.value"
                class="tw-m-2"
                variant="solo"
                density="compact"
                bg-color="rgb(26, 6, 58)"
                color="rgb(250, 245, 255)"
              />
                
              <v-text-field
                v-model="city.value.value"
                class="tw-w-1/3 tw-m-2"
                label="Stadt"
                :error-messages="city.errorMessage.value"
                variant="solo"
                density="compact"
                bg-color="rgb(26, 6, 58)"
                color="rgb(250, 245, 255)"
              />
            </div>
            <v-select
              v-model="country.value.value"
              :items="countryItems"
              :error-messages="country.errorMessage.value"
              label="Land"
              class="tw-m-2"
              variant="solo"
              density="compact"
              bg-color="rgb(26, 6, 58)"
              color="rgb(250, 245, 255)"
            />
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
        </v-form>
  </section>
</template>

<script>
import { Form, useField, useForm } from "vee-validate";
import { uid } from "uid";

import CHECKOUT_MUTATION from "@/apollo/mutations/CHECKOUT_MUTATION.gql";

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
  expose: ['submitCheckout', 'hasFormErrors'],
  emits: ['updatedAddressInfo', 'resetTab'],
  props: {
    tabPos: {
      type: String,
      required: true
    }
  },
  watch: {
    async tabPos(newVal, oldVal) {
      
      await this.submitCheckout()
      if(this.hasFormErrors) {
        this.$emit('gotFormErrors')
        if(newVal === 'payment') {
          this.$emit('resetTab', 'shipping')
        }
      }
    }
  },
  setup(props, context) {
    
    const { handleSubmit, handleReset } = useForm({
      validationSchema: {
        firstName(value) {
            if (!value) return 'Vorname ist ein Pflichtfeld.'
            if (value?.length >= 2) return true
            return 'Vorname muss mindestens zwei Buchstaben enthalten.'
        },
        lastName(value) {
            if (!value) return 'Nachname ist ein Pflichtfeld.'
            if (value?.length >= 2) return true
            return 'Nachname muss mindestens zwei Buchstaben enthalten.'
        },
        email (value) {
            if (!value) return 'E-Mail ist ein Pflichtfeld.'
            if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

            return 'Es muss eine gültige E-Mail Addresse eingegeben werden.'
        },
        address (value) {
            if (!value) return 'Addresse ist ein Pflichtfeld.'
            if (value.length > 35) return 'Addresse darf nicht länger als 35 Zeichen sein.'
            if (value.length < 5) return 'Addresse darf nicht kleiner als fünf Zeichen sein.'

            return true
        },
        zipCode (value) {
            if (!value) return 'Postleitzahl ist ein Pflichtfeld'
            if (value.length > 5) return 'Postleitzahl kann nicht länger als fünf Zeichen sein'
            return true
        },
        country (value) {
            if (!value) return 'Land ist ein Pflichtfeld'
            if (value.length > 30) return 'Land darf nicht länger als 30 Zeichen sein.'
            if (value.length < 2) return 'Land darf nicht kleiner als fünf Zeichen sein.'
          
            return true
        },
        city (value) {
            if (!value) return 'Stadt ist ein Pflichtfeld'           
            if (value.length > 30) return 'Stadt darf nicht länger als 30 Zeichen sein.'          
            if (value.length < 3) return 'Stadt darf nicht kleiner als 3 Zeichen sein.'
        
            return true
        },
        phone (value) {
            if(value === undefined) value = ""
            if (value.length > 35) return 'Handynummer darf nicht länger als 15 Zeichen sein.'
            if (value.length < 5) return 'Handynummer darf nicht kleiner als 10 Zeichen sein.'

            return true
        },
      }
    });

    const firstName = useField('firstName')
    const lastName = useField('lastName')
    const email = useField('email')

    const address = useField('address')
    const zipCode = useField('zipCode')
    const country = useField('country')

    const city = useField('city')
    const phone = useField('phone')
    const submitCheckout = handleSubmit(values => {
      context.emit('updatedAddressInfo', values)
    })
    const hasFormErrors = computed(() => {
      submitCheckout()
      console.log(firstName.errorMessage)
      if(firstName.errorMessage.value) {
        return true
      }
      return false
    })
    return { firstName, lastName, email, address, zipCode, country, city, phone, submitCheckout, hasFormErrors }

  }
}
</script>
