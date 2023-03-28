<template>
  <section class="tw-container tw-p-4 tw-py-2 tw-mx-auto">
    <v-card class="tw-text-black tw-mt-6 lg:tw-mr-4 hover:shadow-2xl account-card-bg tw-h-100">
      <v-card-text>
        <Form :validation-schema="BILLING_SCHEMA" @submit="handleSubmit">
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
                
              <!-- v-bind="city"
              :error-messages="city.errorMessage.value" -->
              <v-text-field
                class="tw-w-1/3 tw-m-2"
                label="Stadt"
                variant="solo"
                density="compact"
                bg-color="rgb(26, 6, 58)"
                color="rgb(250, 245, 255)"
              />
            </div>
            <v-text-field
              v-model="country.value.value"
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
            <!-- v-model="phone" -->
            <!-- :error-messages="phone.errorMessage.value" -->
            <v-text-field
              label="Telefon"
              class="tw-m-2"
              variant="solo"
              density="compact"
              bg-color="rgb(26, 6, 58)"
              color="rgb(250, 245, 255)"
            />
            <div class="tw-w-full tw-flex tw-justify-center tw-mt-6">
              <v-btn color="green" variant="outlined" @click="submitCheckout" ><div class="tw-normal-case">Bestellen</div></v-btn>
            </div>
          </div>
        </Form>
      </v-card-text>
    </v-card>
  </section>
</template>

<script>
import { Form, useField, useForm } from "vee-validate";
import { uid } from "uid";

import { BILLING_FIELDS, BILLING_SCHEMA } from "./constants/BILLING_FIELDS";

import CHECKOUT_MUTATION from "@/apollo/mutations/CHECKOUT_MUTATION.gql";

export default {
  setup() {
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
            if (value.length > 35) return 'Land darf nicht länger als 30 Zeichen sein.'
            if (value.length < 5) return 'Addresse darf nicht kleiner als fünf Zeichen sein.'

            return true
        },
      }
    })

    const firstName = useField('firstName')
    const lastName = useField('lastName')
    const email = useField('email')

    const address = useField('address')
    // const addressNr = useField('addressNr')
    const zipCode = useField('zipCode')
    const country = useField('country')

    const submitCheckout = handleSubmit(values => {
      console.log(values)
      console.log('2do: submit checkout...')
    })
    return { firstName, lastName, email, address, zipCode, country, submitCheckout }

  },
}

const handleSubmit = ({
  firstName,
  lastName,
  address1,
  address2,
  city,
  country,
  state,
  postcode,
  email,
  phone,
  company,
}) => {
  const billing = {
    firstName,
    lastName,
    address1,
    address2,
    city,
    country,
    state,
    postcode,
    email,
    phone,
    company,
  };

  const checkoutData = {
    clientMutationId: uid(),
    billing,
    shipping: billing,
    shipToDifferentAddress: false,
    paymentMethod,
    isPaid: false,
    transactionId: "hjkhjkhsdsdiui",
  };

  const variables = { input: checkoutData };

  const { mutate, onDone, onError } = useMutation(CHECKOUT_MUTATION, {
    variables,
  });

  mutate(checkoutData);

  onDone(async () => await navigateTo("/success"));

  onError(() => alert("Error, order not placed"));
};
</script>
