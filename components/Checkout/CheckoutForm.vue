<template>
  <section class="tw-text-gray-700 tw-container tw-p-4 tw-py-2 tw-mx-auto">
    <Form :validation-schema="BILLING_SCHEMA" @submit="handleSubmit">
      <div class="tw-mx-auto lg:tw-w-1/2 tw-flex tw-flex-wrap">
        <div
          v-for="field in BILLING_FIELDS"
          :key="field.inputId"
          class="tw-w-1/2 tw-p-2"
        >
          <label :for="field.inputId">{{ field.label }}</label>
          <Field v-slot="{ field, meta }" :name="field.inputId">
            <input
              v-bind="field"
              class="tw-w-full tw-px-4 tw-py-2 tw-mt-2 tw-text-base tw-bg-white tw-border tw-border-gray-400 tw-rounded focus:tw-outline-none focus:tw-border-black"
              :class="[
                meta.valid
                  ? 'tw-border-green-700 tw-border-2'
                  : 'tw-border-red-500 tw-border-2',
              ]"
            />
          </Field>
          <ErrorMessage v-slot="{ message }" :name="field.inputId">
            <span class="tw-text-lg tw-text-red-500 tw-font-bold">{{
              upperCaseFirstChar(message)
            }}</span>
          </ErrorMessage>
        </div>
        <div class="tw-w-full tw-flex tw-justify-center tw-mt-6">
          <CommonButton>SUBMIT ORDER</CommonButton>
        </div>
      </div>
    </Form>
  </section>
</template>

<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import { uid } from "uid";

import { BILLING_FIELDS, BILLING_SCHEMA } from "./constants/BILLING_FIELDS";

import CHECKOUT_MUTATION from "@/apollo/mutations/CHECKOUT_MUTATION.gql";

const upperCaseFirstChar = (input) =>
  input.charAt(0).toUpperCase() + input.slice(1);

const paymentMethod = "cod";

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
