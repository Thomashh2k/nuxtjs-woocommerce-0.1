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
          <PersonForm class="max-[960px]:tw-p-8 min-[960px]:tw-pt-8" :user-info="userInfo"  @save="updateUserInfo"/>
        </v-window-item>
        <v-window-item value="deliveryAddress" class="tw-w-full">
          <AddressForm class="max-[960px]:tw-p-8 min-[960px]:tw-pt-8" :address-info="customer.shipping" @save="updateShippingInfo" />
        </v-window-item>
        <v-window-item value="billAddress" class="tw-w-full">
          <AddressForm class="max-[960px]:tw-p-8 min-[960px]:tw-pt-8" :address-info="customer.billing" @save="updateBillingInfo" />
        </v-window-item>
      </v-window>
  </div>
</template>
<script>
import { mdiFile } from '@mdi/js'
import PersonForm from '@/components/Account/forms/PersonForm.vue';
import AddressForm from '@/components/Account/forms/AddressForm.vue';

import { updateUserInfo, updateUserBilling, updateUserShipping } from '@/utils/user.js'
import { useAuth } from '@/store/useAuth.js'

export default {
  components: {
    PersonForm,
    AddressForm
  },
  setup() {
    debugger
    const authStore = useAuth()
    const customer = authStore.getCustomer
    const userInfo = authStore.getUser
    return { authStore, customer, userInfo }
  },
  data() {
    return {
      tab: 'person'
    }
  },
  methods: {
    async updateShippingInfo($event) {
      this.customer.shipping = $event
      await updateUserShipping(this.customer, this.userInfo)
      this.authStore.setCustomer(this.customer)
    },
    async updateBillingInfo($event) {
      this.customer.billing = $event
      await updateUserBilling(this.customer, this.userInfo)
      this.authStore.setCustomer(this.customer)
    },
    async updateUserInfo($event) {
      this.userInfo = $event
      await updateUserInfo(this.userInfo, this.userInfo)
      this.authStore.setUser(this.userInfo)
    }
  }
}
</script>
<style scoped>
.card-bg {
  background: #4c1d95;
}

</style>