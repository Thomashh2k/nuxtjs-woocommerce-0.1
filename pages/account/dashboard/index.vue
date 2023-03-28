<template>
  <div class="tw-flex tw-flex-row">
    <div class="tw-w-1/6 max-[1325px]:tw-w-16">
      <v-list nav class="card-bg tw-flex tw-flex-col tw-h-full">
        <v-list-item  @click="tab = 'person'">
          <div class="tw-text-purple-50 tw-normal-case  tw-flex">
            <v-icon icon="mdi-account" class="tw-mr-2"></v-icon>
            <p class="max-[1325px]:tw-hidden">Person</p>
          </div>
        </v-list-item>
        <v-list-item @click="tab = 'payments'">
          <div class="tw-text-purple-50 tw-normal-case tw-flex">
            <v-icon icon="mdi-credit-card" class="tw-mr-2"></v-icon>
            <p class="max-[1325px]:tw-hidden">Zahlungswege</p>
          </div>
        </v-list-item>
        <v-list-item @click="tab = 'deliveryAddress'">
          <div class="tw-text-purple-50 tw-normal-case tw-flex">
            <v-icon icon="mdi-truck-delivery-outline" class="tw-mr-2"></v-icon>
            <p class="max-[1325px]:tw-hidden">Lieferanschrift</p>
          </div>
        </v-list-item>
        <v-list-item @click="tab = 'billAddress'">
          <div class="tw-text-purple-50 tw-normal-case tw-flex">
            <v-icon icon="mdi-file" class="tw-mr-2"></v-icon>
            <p class="max-[1325px]:tw-hidden">Rechnungsanschrift</p>
          </div>
        </v-list-item>
      </v-list>
    </div>
    <v-window v-model="tab" class="tw-flex tw-justify-center tw-w-full tw-h-full tw-items-center">
        <v-window-item value="person" class="tw-w-full">
          <PersonForm class="max-[960px]:tw-p-8 min-[960px]:tw-pt-8" />
        </v-window-item>

        <v-window-item value="payments" class="tw-w-full">
          Two
        </v-window-item>

        <v-window-item value="deliveryAddress" class="tw-w-full">
          Three
        </v-window-item>
        <v-window-item value="billAddress" class="tw-w-full">
          Four
        </v-window-item>
      </v-window>
  </div>
</template>
<script>
import { mdiFile } from '@mdi/js'
import PersonForm from '@/components/Account/forms/PersonForm.vue';
export default {
  components: {
    PersonForm
  },
  data() {
    return {
      tab: 'person'
    }
  },
}
</script>
<style scoped>
.card-bg {
  background: #4c1d95;
}

</style>