<template>
    <h1 class="tw-text-purple-50 tw-text-xl tw-text-center tw-mb-4">Sofort Bestellen</h1>
    <div v-if="product.databaseId !== undefined" class="tw-flex tw-justify-center">
      <NuxtLink class="tw-flex tw-flex-col tw-justify-items-center" :to="{path: '/product/' + product.slug, query: { id:  product.databaseId }}">
      <img :src="product.image.sourceUrl" class="2xl:tw-h-72 xl:tw-h-72 lg:tw-h-72 md:tw-h-56 sm:tw-h-48 xs:tw-h-48 xxs:tw-h-48 2xl:tw-w-72 xl:tw-w-72 lg:tw-w-72 md:tw-w-56 sm:tw-w-48 xs:tw-w-48 xxs:tw-w-48 tw-ml-6" />
      <div class="tw-flex tw-flex-col tw-pl-4 tw-mt-4">
          <span class="tw-text-purple-50 hover:tw-underline lg:tw-text-lg  tw-font-bold tw-text-center tw-truncate">{{ product.name }}</span>
          <span class="tw-text-purple-50 hover:tw-underline lg:tw-text-lg  tw-font-bold tw-text-center tw-truncate">{{ product.price + ' €' }}</span>
      </div>
      </NuxtLink>
    </div>
    <v-skeleton-loader v-else class="card-bg-color"></v-skeleton-loader>
</template>
<script>
import * as labsComponents from 'vuetify/labs/components'

export default {
  name: 'SelectedProduct',
  components: {
    ...labsComponents,
  },
  props: {
    product: {
      type: Object,
      required: true
    },
  }
}
</script>
<style>
  .card-bg-color {
      /* background: rgb(26, 6, 58) !important; */
      background-color: rgb(76 29 149 / var(--tw-bg-opacity));
  }
</style>